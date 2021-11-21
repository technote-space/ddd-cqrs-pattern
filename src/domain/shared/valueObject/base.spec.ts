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
});
