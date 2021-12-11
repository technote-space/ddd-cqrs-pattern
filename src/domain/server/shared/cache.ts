export type Key = string;

export interface ICache {
  get<T>(key: Key): T | undefined;

  set<T>(key: Key, value: T, ttlSec?: number): boolean;

  del(key: Key): void;

  getOrGenerate<T>(key: Key, generate: (key: Key) => Promise<T>, ttlSec?: number): Promise<T>;
}
