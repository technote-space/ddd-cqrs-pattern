import EstimateUnit from '$/server/task/valueObject/estimateUnit';
import EstimateValue from '$/server/task/valueObject/estimateValue';
import Estimate from './estimate';

describe('EstimateUnit', () => {
  it('名前が「作業見積」', () => {
    expect(Estimate.create({
      value: EstimateValue.create(1),
      unit: EstimateUnit.create('日'),
    }).getName()).toBe('作業見積');
  });

  it('作業見積単位が「時間」の場合の時間の計算', () => {
    const estimate = Estimate.create({
      value: EstimateValue.create(3),
      unit: EstimateUnit.create('時間'),
    });
    expect(estimate.hours).toBe(3);
    expect(estimate.hours).toBe(3);
  });

  it('作業見積単位が「日」の場合の時間の計算', () => {
    const estimate = Estimate.create({
      value: EstimateValue.create(3),
      unit: EstimateUnit.create('日'),
    });
    expect(estimate.hours).toBe(3 * 24);
    expect(estimate.hours).toBe(3 * 24);
  });

  it('比較', () => {
    const estimate1 = Estimate.create({
      value: EstimateValue.create(3),
      unit: EstimateUnit.create('時間'),
    });
    const estimate2 = Estimate.create({
      value: EstimateValue.create(1),
      unit: EstimateUnit.create('日'),
    });
    const estimate3 = Estimate.create({
      value: EstimateValue.create(24),
      unit: EstimateUnit.create('時間'),
    });

    expect(estimate1.compare(estimate2)).toBe(-1);
    expect(estimate2.compare(estimate1)).toBe(1);
    expect(estimate2.compare(estimate3)).toBe(0);
    expect(estimate1.equals(estimate2)).toBe(false);
    expect(estimate2.equals(estimate3)).toBe(true);
  });

  it('validate が 作業見積値と作業見積単位の validate 結果を返す', () => {
    expect(Estimate.create({
      value: EstimateValue.create(3),
      unit: EstimateUnit.create('時間'),
    }).validate()).toEqual([]);

    expect(Estimate.create({
      value: EstimateValue.create(0),
      unit: EstimateUnit.create('時間'),
    }).validate()).toEqual(['1以上の値を入力してください']);
  });
});
