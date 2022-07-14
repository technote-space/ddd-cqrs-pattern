import EstimateValue from './estimateValue';

describe('EstimateValue', () => {
  it('ラベルが「作業見積値」', () => {
    expect(EstimateValue.getLabel()).toBe('作業見積値');
  });

  it('値が 1 より小さいとエラー', () => {
    expect(EstimateValue.create(1).getErrors('estimateValue')).toEqual(undefined);
    expect(EstimateValue.create(0).getErrors('estimateValue')).toEqual([{ name: 'estimateValue', error: '1以上の値を入力してください' }]);
  });
});
