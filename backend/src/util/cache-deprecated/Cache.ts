/**
 * Cache interface
 */
export interface Cache<T = string, S = string> {
  reset(): Promise<void>;
  has(key: T): Promise<boolean>;
  get(key: T): Promise<S | undefined>;
  set(key: T, value: S): Promise<void>;
  delete(key: T): Promise<void>;
}
