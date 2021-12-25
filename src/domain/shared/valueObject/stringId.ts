import type { ValidationError } from './base';
import InvalidValueException from '$/shared/exceptions/domain/invalidValue';
import Base from './base';

export default abstract class StringId extends Base<number | string | null, string, string | null>() {
  protected fromInput(): string | null {
    if (this.input === null) {
      return null;
    }

    return `${this.input}`;
  }

  protected toOutput(): string {
    if (this.inner === null) {
      throw new InvalidValueException(this.getName());
    }

    return super.toOutput();
  }

  public isSetId(): boolean {
    return this.input !== null && this.input !== undefined;
  }

  public setGeneratedId(id: number | string): void {
    this.reconstruct(id);
  }

  public validate(): ValidationError[] | undefined {
    const text = this.fromInput();
    if (text === null) {
      return undefined;
    }

    if (!text.length) {
      return [{ name: this.getName(), error: '値を指定してください' }];
    }

    return undefined;
  }

  public compare(value: this): number {
    return this.value.localeCompare(value.value);
  }
}
