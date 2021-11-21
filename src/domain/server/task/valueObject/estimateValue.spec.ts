import EstimateValue from './estimateValue';

describe('EstimateValue', () => {
  it('名前が「作業見積値」', () => {
    expect(EstimateValue.create(1).getName()).toBe('作業見積値');
  });

  it('値が 1 より小さいとエラー', () => {
    expect(EstimateValue.create(1).validate()).toEqual(undefined);
    expect(EstimateValue.create(0).validate()).toEqual(['1以上の値を入力してください']);
  });
});
