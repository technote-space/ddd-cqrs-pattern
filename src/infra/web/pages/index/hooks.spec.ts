import { useHooks } from './hooks';

describe('useHooks', () => {
  it('should return empty', () => {
    expect(useHooks({})).toEqual({});
  });
});
