import isNumeric from 'validator/lib/isNumeric';
import Base from './base';

export default abstract class Float extends Base<number | string, number>() {
  protected fromInput(): number {
    if (typeof this.input === 'number') {
      return this.input;
    }

    let num = parseFloat(this.input);
    const max = this.getMaxNumber();
    if (max !== undefined && num > max && this.isTruncateMode()) {
      num = Math.min(max, num);
    }

    const min = this.getMinNumber();
    if (min !== undefined && num < min && this.isTruncateMode()) {
      num = Math.max(min, num);
    }

    return num;
  }

  protected getMaxNumber(): number | undefined {
    return undefined;
  }

  protected getMinNumber(): number | undefined {
    return undefined;
  }

  protected isTruncateMode(): boolean {
    return false;
  }

  public validate(): string[] | undefined {
    if (typeof this.input === 'string' && !isNumeric(this.input)) {
      return ['数値の形式が正しくありません'];
    }

    const num = this.fromInput();
    const max = this.getMaxNumber();
    if (max !== undefined && num > max) {
      return [`${max}以下の値を入力してください`];
    }

    const min = this.getMinNumber();
    if (min !== undefined && num < min) {
      return [`${min}以上の値を入力してください`];
    }

    return undefined;
  }

  public compare(value: this): number {
    const diff = this.value - value.value;
    if (diff < 0) return -1;
    if (diff > 0) return 1;
    return 0;
  }
}
