import { getDiffString } from './dueDate';

describe('getDiffString', () => {
  it('数値を文字列時間化', () => {
    expect(getDiffString(3 * 24 * 60 * 60 * 1000 + 10)).toBe('3日');
    expect(getDiffString(12 * 60 * 60 * 1000 + 10)).toBe('12時間');
    expect(getDiffString(21 * 60 * 1000 + 10)).toBe('21分');
    expect(getDiffString(35 * 1000 + 10)).toBe('35秒');
  });
});
