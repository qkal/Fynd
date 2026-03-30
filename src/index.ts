import { CacheStore } from './core/cache';
import { normalizeKey, serializeKey } from './core/key';
import { CACHE_DEFAULTS } from './core/types';
import type { CacheConfig, QueryConfig } from './core/types';
import { createReactiveQuery } from './svelte/adapter.svelte';

export type { CacheConfig, QueryConfig } from './core/types';
export type { QueryStatus } from './core/types';

/**
 * The reactive object returned by `cache.query()`.
 * Properties are getters — do not destructure, as that breaks Svelte 5 reactivity.
 */
export interface QueryResult<T> {
  readonly status: 'idle' | 'loading' | 'refreshing' | 'success' | 'error';
  readonly data: T | undefined;
  readonly error: Error | null;
  readonly isStale: boolean;
  refetch(): Promise<void>;
}

/**
 * Creates a cache instance with global configuration.
 * Call once per app, typically in `$lib/cache.ts`.
 *
 * @example
 * import { createCache } from 'kvale';
 * export const cache = createCache({ staleTime: 30_000 });
 */
export function createCache(config: Partial<CacheConfig> = {}) {
  const resolvedConfig: CacheConfig = { ...CACHE_DEFAULTS, ...config };
  const store = new CacheStore({ persist: resolvedConfig.persist, gcTime: resolvedConfig.gcTime });

  return {
    /**
     * Creates a reactive query bound to this cache instance.
     * Returns a reactive object — access properties directly, do not destructure.
     *
     * @example
     * const todos = cache.query<Todo[]>({
     *   key: 'todos',
     *   fn: () => fetch('/api/todos').then(r => r.json()),
     * });
     * // In template: {#if todos.status === 'loading'}
     */
    query<T>(queryConfig: QueryConfig<T>): QueryResult<T> {
      return createReactiveQuery(store, queryConfig, resolvedConfig) as QueryResult<T>;
    },

    /**
     * Returns the raw cached data for `key`, or `undefined` if not present.
     * Does not trigger a fetch. Accepts string or array keys.
     *
     * @example
     * cache.getQueryData<Todo[]>('todos')
     * cache.getQueryData<Todo>(['todos', 1])
     */
    getQueryData<T>(key: string | unknown[]): T | undefined {
      const serialized = serializeKey(normalizeKey(key));
      return store.getQueryData<T>(serialized);
    },
  };
}
