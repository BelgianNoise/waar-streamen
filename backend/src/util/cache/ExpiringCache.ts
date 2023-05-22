import { Cache } from './Cache';

/**
 * A cache that expires after a certain amount of time.
 */
export abstract class ExpiringCache<T = string, S = string>
  implements Cache<T, S>
{
  protected readonly cacheExpirationMinutes: number;

  protected constructor() {
    this.cacheExpirationMinutes = Number(
      process.env.CACHE_RETENTION_MINUTES || 24 * 60,
    );
  }

  abstract reset(): Promise<void>;
  abstract has(key: T): Promise<boolean>;
  abstract get(key: T): Promise<S | undefined>;
  abstract set(key: T, value: S): Promise<void>;
  abstract delete(key: T): Promise<void>;
  protected abstract isExpired(key: T): Promise<boolean>;
}
