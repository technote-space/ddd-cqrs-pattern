import NodeCacheCache from './nodeCacheCache';

describe('Cache', () => {
  it('should store data', () => {
    const cache = new NodeCacheCache();
    expect(cache.get('test')).toBeUndefined();
    expect(cache.set('test', 123)).toBeTruthy();
    expect(cache.get('test')).toBe(123);

    cache.del('test');
    expect(cache.get('test')).toBeUndefined();
  });

  it('should get or generate data', async () => {
    const cache = new NodeCacheCache();
    expect(await cache.getOrGenerate('test', () => Promise.resolve(123))).toBe(123);
    expect(await cache.getOrGenerate('test', () => Promise.resolve(456))).toBe(123);
  });

  it('should consider ttl', () => {
    jest.useFakeTimers();
    const cache = new NodeCacheCache();
    expect(cache.get('test')).toBeUndefined();
    expect(cache.set('test', 123, 10)).toBeTruthy();
    expect(cache.get('test')).toBe(123);
    jest.advanceTimersByTime(8000);
    expect(cache.get('test')).toBe(123);
    jest.advanceTimersByTime(3000);
    expect(cache.get('test')).toBeUndefined();
  });
});
