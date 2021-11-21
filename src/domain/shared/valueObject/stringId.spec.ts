import StringId from './stringId';

class TestStringId extends StringId {
  public getName(): string {
    return 'test';
  }
}

describe('StringId', () => {
  it('should create stringId', () => {
    expect(TestStringId.create('test').value).toBe('test');
    expect(TestStringId.create('123').value).toBe('123');
  });

  it('should compare stringId', () => {
    const stringId1 = TestStringId.create('abc');
    const stringId2 = TestStringId.create('def');
    const stringId3 = TestStringId.create('def');
    expect(stringId1.compare(stringId2)).toBe(-1);
    expect(stringId2.compare(stringId1)).toBe(1);
    expect(stringId2.compare(stringId3)).toBe(0);
    expect(stringId1.equals(stringId2)).toBe(false);
    expect(stringId2.equals(stringId3)).toBe(true);
  });

  it('should validate', () => {
    expect(TestStringId.create('123').validate()).toBeUndefined();
    expect(TestStringId.create(null).validate()).toBeUndefined();
    expect(TestStringId.create('').validate()).toEqual(['値を指定してください']);
  });

  it('should set generated id', () => {
    const id = TestStringId.create(null);
    id.setGeneratedId('123');
    expect(id.value).toBe('123');
  });

  it('should throw error if id is not set', () => {
    const id = TestStringId.create(null);
    expect(() => id.value).toThrow('無効な値です');
  });
});
