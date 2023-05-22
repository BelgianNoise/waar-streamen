import { ExpiringCache } from './ExpiringCache';

/**
 * InMemoryExpiringCache is a simple in-memory cache that expires after a given
 * amount of minutes.
 */
export abstract class InMemoryExpiringCache<
  T = string,
  S = string,
> extends ExpiringCache<T, S> {
  private cache: Map<T, { lastUpdated: string; values: S }>;

  constructor() {
    super();
    this.cache = new Map();
  }

  public async reset(): Promise<void> {
    this.cache.clear();
  }

  public async has(key: T): Promise<boolean> {
    if (await this.isExpired(key)) this.cache.delete(key);
    return this.cache.has(key);
  }

  public async get(key: T): Promise<S | undefined> {
    if (await this.isExpired(key)) this.cache.delete(key);
    return this.cache.get(key)?.values;
  }

  public async set(key: T, value: S): Promise<void> {
    this.cache.set(key, {
      lastUpdated: new Date().toISOString(),
      values: value,
    });
  }

  public async delete(key: T): Promise<void> {
    this.cache.delete(key);
  }

  protected async isExpired(key: T): Promise<boolean> {
    const cached = this.cache.get(key);
    if (!cached) return true;

    const now = new Date().getTime();
    const lastUpdated = new Date(cached.lastUpdated).getTime();
    const diff = now - lastUpdated;
    const minutes = Math.floor(diff / 1000 / 60);
    return minutes >= this.cacheExpirationMinutes;
  }
}
