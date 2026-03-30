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
 * Global cache configuration, passed to `createCache()`.
 *
 * @example
 * createCache({ staleTime: 60_000, retry: 2, refetchOnWindowFocus: false })
 */
export interface CacheConfig {
  /** Milliseconds before cached data is considered stale. Default: 30_000 */
  staleTime: number;
  /** Number of retry attempts on fetch failure. Default: 1 */
  retry: number;
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

/**
 * Internal reactive state of a query.
 */
export interface QueryState<T> {
  status: QueryStatus;
  data: T | undefined;
  error: Error | null;
  isStale: boolean;
}

/**
 * Internal reactive state of a mutation.
 */
export interface MutationState<TData> {
  status: MutationStatus;
  data: TData | undefined;
  error: Error | null;
}

/**
 * A single cached entry stored in CacheStore.
 */
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
