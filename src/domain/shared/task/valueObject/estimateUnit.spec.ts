import EstimateUnit from './estimateUnit';

describe('EstimateUnit', () => {
  it('ラベルが「作業見積単位」', () => {
    expect(EstimateUnit.getLabel()).toBe('作業見積単位');
  });
});
