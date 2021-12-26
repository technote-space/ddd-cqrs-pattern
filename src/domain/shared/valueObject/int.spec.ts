import Int from './int';

class TestInt extends Int {
  public getName(): string {
    return 'test';
  }
}

describe('Int', () => {
  it('should validate', () => {
    expect(TestInt.create('123').validate()).toBeUndefined();
    expect(TestInt.create('abc').validate()).toEqual([{ name: 'test', error: '数値の形式が正しくありません' }]);
    expect(TestInt.create('123.45').validate()).toEqual([{ name: 'test', error: '整数の形式が正しくありません' }]);
    expect(TestInt.create('10000000000000000').validate()).toEqual([{ name: 'test', error: '有効な整数ではありません' }]);
  });
});
