import EstimateUnit from './estimateUnit';

describe('EstimateUnit', () => {
  it('名前が「作業見積単位」', () => {
    expect(EstimateUnit.create('日').getName()).toBe('作業見積単位');
  });
});
