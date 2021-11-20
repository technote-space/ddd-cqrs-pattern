import Base from './base';

export default abstract class StringId extends Base<number | string, string>() {
  protected fromInput(): string {
    return `${this.input}`;
  }

  public validate(): string[] | undefined {
    const text = this.fromInput();
    if (!text.length) {
      return ['値を指定してください'];
    }

    return undefined;
  }

  public compare(value: this): number {
    return this.value.localeCompare(value.value);
  }
}
