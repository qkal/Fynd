/**
 * Status of a query. Represents mutually exclusive states — only one is true at a time.
 *
 * - `idle`       Query has not executed. Either `enabled` is false, or it just initialized.
 * - `loading`    First fetch in progress with no cached data.
 * - `refreshing` Background refetch in progress; stale data is visible.
 * - `success`    Fetch completed successfully.
 * - `error`      All retries exhausted; `error` is set.
 */
export type QueryStatus = 'idle' | 'loading' | 'refreshing' | 'success' | 'error';

/** Status of a mutation. */
export type MutationStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * A lifecycle event emitted by the cache. Subscribe via `createCache({ onEvent })`.
 *
 * - `fetch:start`   A network request began (not fired for dedup consumers).
 * - `fetch:success` A network request completed successfully.
 * - `fetch:error`   A network request failed (fires on every attempt, including retries).
 * - `invalidate`    `cache.invalidate()` was called; lists every matched key.
 * - `set`           `cache.setQueryData()` wrote data directly.
 * - `gc`            A cache entry was pruned by gcTime.
 * - `rehydrate`     `cache.rehydrate()` seeded entries from a server snapshot.
 */
export type CacheEvent =
  | { type: 'fetch:start'; key: unknown[] }
  | { type: 'fetch:success'; key: unknown[]; duration: number }
  | { type: 'fetch:error'; key: unknown[]; error: Error; failureCount: number }
  | { type: 'invalidate'; key: unknown[]; matchedKeys: unknown[][] }
  | { type: 'set'; key: unknown[] }
  | { type: 'gc'; key: unknown[] }
  | { type: 'rehydrate'; keys: unknown[][] };

/**
 * Serializable snapshot of cache entries produced by `cache.dehydrate()`.
 * Pass it through SvelteKit's `load()` return value, then seed the client
 * cache with `cache.rehydrate(data.dehydrated)`.
 */
export interface DehydratedState {
  entries: Array<{
    key: string; // serialized cache key
    data: unknown; // raw T — never transformed by select
    timestamp: number; // original server-side timestamp
  }>;
}

/**
 * Global cache configuration, passed to `createCache()`.
 *
 * @example
 * createCache({ staleTime: 60_000, retry: 2, refetchOnWindowFocus: false })
 */
export interface CacheConfig {
  /** Milliseconds before cached data is considered stale. Default: 30_000 */
  staleTime: number;
  /**
   * Retry strategy on fetch failure. Pass a number for a fixed retry count,
   * or a function for conditional retries (e.g. skip retrying 401s).
   * Default: 1
   *
   * @example
   * retry: (count, error) => (error as any).status !== 401 && count < 3
   */
  retry: number | ((failureCount: number, error: Error) => boolean);
  /** Refetch stale queries when the browser tab regains focus. Default: true */
  refetchOnWindowFocus: boolean;
  /** Refetch stale queries when the browser comes back online. Default: true */
  refetchOnReconnect: boolean;
  /** Optional Storage for cache persistence across page loads. Default: undefined */
  persist?: Storage;
  /**
   * Milliseconds before an inactive (no subscribers) cache entry is garbage collected.
   * Default: 300_000 (5 minutes)
   */
  gcTime: number;
  /**
   * Abort any fetch that has not resolved within this many milliseconds.
   * Each retry attempt gets its own fresh timeout. Default: undefined (no timeout).
   */
  timeout?: number;
  /**
   * Called once after all retries are exhausted for a query, or after a mutation fails.
   * Mutations pass `key: []`. Errors thrown by this hook are silently swallowed.
   */
  onError?: (error: Error, key: unknown[]) => void;
  /**
   * Called for every cache lifecycle event, including intermediate retry failures.
   * Errors thrown by this hook are silently swallowed.
   */
  onEvent?: (event: CacheEvent) => void;
}

/**
 * Per-query configuration, passed to `cache.query()`.
 *
 * @example
 * cache.query<Todo[]>({
 *   key: 'todos',
 *   fn: (signal) => fetch('/api/todos', { signal }).then(r => r.json()),
 *   enabled: () => !!userId,
 * })
 */
export interface QueryConfig<T, U = T> {
  /**
   * Cache key. String auto-wraps to array: `'todos'` → `['todos']`.
   * Accepts a getter function for reactive keys: `() => ['todos', userId]`.
   * The getter is read inside `$effect` — Svelte tracks reactive dependencies automatically.
   */
  key: string | unknown[] | (() => string | unknown[]);
  /**
   * Async function that returns the data. Receives an AbortSignal — pass it to fetch
   * so the request is cancelled when the component unmounts or the key changes.
   */
  fn: (signal: AbortSignal) => Promise<T>;
  /** Override global staleTime for this query only. */
  staleTime?: number;
  /** Auto-refetch interval in ms. Undefined = no polling. */
  refetchInterval?: number;
  /**
   * Whether to execute the query. Accepts a getter function for reactive
   * dependent queries: `enabled: () => !!user.data?.id`
   */
  enabled?: boolean | (() => boolean);
  /**
   * When the key changes (reactive key), show the previous data with `status: 'refreshing'`
   * instead of clearing to `status: 'loading'`. Default: false.
   */
  keepPreviousData?: boolean;
  /**
   * Transform data before it reaches the component. Cache always stores raw `T`.
   * The component receives `U`. Type changes: `cache.query<Todo[], ActiveTodo[]>({ select: ... })`.
   */
  select?: (data: T) => U;
  /**
   * Per-query retry override. Overrides `CacheConfig.retry` for this query only.
   * Accepts a number or a predicate function.
   */
  retry?: number | ((failureCount: number, error: Error) => boolean);
  /**
   * Abort this query's fetch after N milliseconds. Each retry gets a fresh timeout.
   * Overrides `CacheConfig.timeout` for this query only.
   */
  timeout?: number;
}

/**
 * Per-mutation configuration, passed to `cache.mutate()`.
 * `TContext` is the return type of `onMutate` — used for optimistic rollback.
 *
 * @example
 * cache.mutate({
 *   fn: (id: number, signal) => fetch(`/api/todos/${id}`, { method: 'DELETE', signal }),
 *   onMutate: (id) => {
 *     const prev = cache.getQueryData<Todo[]>('todos');
 *     cache.setQueryData('todos', prev?.filter(t => t.id !== id));
 *     return prev; // rollback context
 *   },
 *   onError: (_err, _id, prev) => cache.setQueryData('todos', prev),
 *   onSettled: () => cache.invalidate('todos'),
 * })
 */
export interface MutationConfig<TData, TVariables, TContext = unknown> {
  fn: (variables: TVariables, signal: AbortSignal) => Promise<TData>;
  /** Called before `fn`. Return value is the `context` passed to `onSuccess`, `onError`, `onSettled`. */
  onMutate?: (variables: TVariables) => TContext | Promise<TContext>;
  onSuccess?: (data: TData, variables: TVariables, context: TContext) => void | Promise<void>;
  onError?: (error: Error, variables: TVariables, context: TContext) => void | Promise<void>;
  onSettled?: (
    data: TData | undefined,
    error: Error | null,
    variables: TVariables,
    context: TContext,
  ) => void | Promise<void>;
}

/** Internal reactive state of a query. */
export interface QueryState<T> {
  status: QueryStatus;
  data: T | undefined;
  error: Error | null;
  isStale: boolean;
}

/** Internal reactive state of a mutation. */
export interface MutationState<TData> {
  status: MutationStatus;
  data: TData | undefined;
  error: Error | null;
}

/** A single cached entry stored in CacheStore. */
export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  error: Error | null;
}

/** Callback type for QueryRunner subscribers. */
export type QuerySubscriber<T> = (state: QueryState<T>) => void;

// ─── Default constants ────────────────────────────────────────────────────────

export const DEFAULT_STALE_TIME = 30_000;
export const DEFAULT_RETRY = 1;
export const DEFAULT_REFETCH_ON_WINDOW_FOCUS = true;
export const DEFAULT_REFETCH_ON_RECONNECT = true;
export const DEFAULT_GC_TIME = 300_000;

export const CACHE_DEFAULTS: CacheConfig = {
  staleTime: DEFAULT_STALE_TIME,
  retry: DEFAULT_RETRY,
  refetchOnWindowFocus: DEFAULT_REFETCH_ON_WINDOW_FOCUS,
  refetchOnReconnect: DEFAULT_REFETCH_ON_RECONNECT,
  persist: undefined,
  gcTime: DEFAULT_GC_TIME,
};
