import type { ICache, Key } from '$/server/shared/cache';
import NodeCache from 'node-cache';
import { singleton } from 'tsyringe';

@singleton()
export default class NodeCacheCache implements ICache {
  private cache: NodeCache;

  public constructor() {
    this.cache = new NodeCache();
  }

  public get<T>(key: Key): T | undefined {
    return this.cache.get<T>(key);
  }

  public set<T>(key: Key, value: T, ttlSec?: number): boolean {
    if (ttlSec) {
      return this.cache.set(key, value, ttlSec);
    }

    return this.cache.set(key, value);
  }

  public del(key: Key): void {
    this.cache.del(key);
  }

  public async getOrGenerate<T>(key: Key, generate: (key: Key) => Promise<T>, ttlSec?: number): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    const generated = await generate(key);
    this.set(key, generated, ttlSec);

    return generated;
  }
}
