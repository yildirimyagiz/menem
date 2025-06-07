// Simple in-memory cache for dev/small scale
export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, value: T, ttlMs: number) {
    this.cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    return entry.value;
  }

  delete(key: string) {
    this.cache.delete(key);
  }
}

export const globalCache = new SimpleCache();
