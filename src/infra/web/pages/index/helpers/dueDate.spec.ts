import DueDate from '$/shared/task/valueObject/dueDate';
import Estimate from '$/shared/task/valueObject/estimate';
import EstimateUnit from '$/shared/task/valueObject/estimateUnit';
import EstimateValue from '$/shared/task/valueObject/estimateValue';
import { getStartDate } from './dueDate';

describe('getStartDate', () => {
  it('無効な値の場合に null を返す', () => {
    expect(getStartDate(null, null)).toBeNull();
  });

  it('作業開始日時を返す', () => {
    expect(getStartDate(DueDate.create('2000-01-23 12:00'), Estimate.create({
      value: EstimateValue.create(10),
      unit: EstimateUnit.create('日'),
    }))?.format('YYYY/MM/DD HH:mm')).toBe('2000/01/13 12:00');
    expect(getStartDate(DueDate.create('2000-01-23 12:00'), Estimate.create({
      value: EstimateValue.create(10),
      unit: EstimateUnit.create('時間'),
    }))?.format('YYYY/MM/DD HH:mm')).toBe('2000/01/23 02:00');
  });
});
