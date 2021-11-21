import Int from './int';

class TestInt extends Int {
  public getName(): string {
    return 'test';
  }
}

describe('Int', () => {
  it('should validate', () => {
    expect(TestInt.create('123').validate()).toBeUndefined();
    expect(TestInt.create('abc').validate()).toEqual(['数値の形式が正しくありません']);
    expect(TestInt.create('123.45').validate()).toEqual(['整数の形式が正しくありません']);
    expect(TestInt.create('10000000000000000').validate()).toEqual(['有効な整数ではありません']);
  });
});
