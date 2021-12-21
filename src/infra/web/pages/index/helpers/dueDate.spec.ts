import { getStartDate } from './dueDate';

describe('getStartDate', () => {
  it('無効な値の場合に null を返す', () => {
    expect(getStartDate(null, null, null)).toBeNull();
  });

  it('unit が無効な値の場合に null を返す', () => {
    expect(getStartDate('2000-01-23', 10, 'test')).toBeNull();
  });

  it('作業開始日時を返す', () => {
    expect(getStartDate('2000-01-23 12:00', 10, '日')?.format('YYYY/MM/DD HH:mm')).toBe('2000/01/13 12:00');
    expect(getStartDate('2000-01-23 12:00', 10, '時間')?.format('YYYY/MM/DD HH:mm')).toBe('2000/01/23 02:00');
  });
});
