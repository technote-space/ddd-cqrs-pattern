import Base from './base';

class Test extends Base<number, number>() {
  public getName(): string {
    return 'test';
  }

  public compare(): number {
    return 0;
  }

  public validate(): string[] | undefined {
    return undefined;
  }

  public getInner() {
    return this.inner;
  }

  public reset(value: number): void {
    this.reconstruct(value);
  }
}

class TestArray extends Base<number[], number[]>() {
  public getName(): string {
    return 'test';
  }

  public compare(): number {
    return 0;
  }

  public validate(): string[] | undefined {
    return undefined;
  }

  public reset(value: number[]): void {
    this.reconstruct(value);
  }
}

class TestObject extends Base<{ test: number }, { test: number }>() {
  public getName(): string {
    return 'test';
  }

  public compare(): number {
    return 0;
  }

  public validate(): string[] | undefined {
    return undefined;
  }

  public reset(value: number): void {
    this.reconstruct({ test: value });
  }
}

describe('Base', () => {
  it('should cache', () => {
    const test = Test.create(123);
    expect(test.value).toBe(123);
    expect(test.value).toBe(123);
    expect(test.getInner()).toBe(123);
    expect(test.getInner()).toBe(123);
  });

  it('should reconstruct', () => {
    const test = Test.create(123);
    expect(test.value).toBe(123);
    expect(test.value).toBe(123);
    test.reset(234);
    expect(test.value).toBe(234);
    expect(test.value).toBe(234);
  });

  it('should throw error if call constructor directory', () => {
    expect(() => new Test()).toThrow();
  });

  it('should throw error if push to array', () => {
    const test = TestArray.create([1, 2, 3]);
    expect(test.value).toEqual([1, 2, 3]);
    expect(test.value).toEqual([1, 2, 3]);
    test.reset([2, 3, 4]);
    expect(test.value).toEqual([2, 3, 4]);
    expect(test.value).toEqual([2, 3, 4]);

    expect(() => test.value.push(5)).toThrow();
  });

  it('should throw error if update object property', () => {
    const test = TestObject.create({ test: 123 });
    expect(test.value).toEqual({ test: 123 });
    expect(test.value).toEqual({ test: 123 });
    test.reset(234);
    expect(test.value).toEqual({ test: 234 });
    expect(test.value).toEqual({ test: 234 });

    expect(() => {
      test.value.test = 345;
    }).toThrow();
  });
});
