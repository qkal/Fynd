import type { CacheConfig, CacheEntry } from './types';
import { hydrateCache, persistCache } from './storage';

type CacheSubscriber = () => void;

/**
 * In-memory cache store. Manages entries, staleness, subscriber notifications,
 * and optional localStorage persistence.
 *
 * @example
 * const store = new CacheStore({ persist: localStorage });
 * store.set('["todos"]', { data: [], timestamp: Date.now(), error: null });
 * store.isStale('["todos"]', 30_000); // false immediately after set
 */
export class CacheStore {
  private readonly entries: Map<string, CacheEntry>;
  private readonly subscribers: Map<string, Set<CacheSubscriber>> = new Map();
  private readonly config: Pick<CacheConfig, 'persist'>;

  constructor(config: Pick<CacheConfig, 'persist'>) {
    this.config = config;
    this.entries = config.persist ? hydrateCache(config.persist) : new Map();
  }

  /** Returns the cached entry for `key`, or `undefined` if not present. */
  get(key: string): CacheEntry | undefined {
    return this.entries.get(key);
  }

  /** Stores `entry` under `key`, persists to storage (if configured), and notifies subscribers. */
  set(key: string, entry: CacheEntry): void {
    this.entries.set(key, entry);
    if (this.config.persist) {
      persistCache(this.config.persist, this.entries);
    }
    this.notify(key);
  }

  /**
   * Returns true if the entry for `key` is older than `staleTime` ms,
   * or if no entry exists.
   */
  isStale(key: string, staleTime: number): boolean {
    const entry = this.entries.get(key);
    if (!entry) return true;
    return Date.now() - entry.timestamp > staleTime;
  }

  /** Removes the entry for `key` and notifies subscribers. No-op if key does not exist. */
  delete(key: string): void {
    this.entries.delete(key);
    this.notify(key);
  }

  /** Removes all entries and notifies all subscribers. */
  clear(): void {
    const keys = [...this.entries.keys()];
    this.entries.clear();
    for (const key of keys) this.notify(key);
  }

  /**
   * Subscribe to changes for a specific cache key.
   * Returns an unsubscribe function.
   */
  subscribe(key: string, callback: CacheSubscriber): () => void {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key)!.add(callback);
    return () => {
      this.subscribers.get(key)?.delete(callback);
    };
  }

  private notify(key: string): void {
    this.subscribers.get(key)?.forEach((cb) => cb());
  }
}
