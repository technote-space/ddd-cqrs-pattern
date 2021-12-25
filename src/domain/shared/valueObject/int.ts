import type { ValidationError } from './base';
import isInt from 'validator/lib/isInt';
import Float from './float';

export default abstract class Int extends Float {
  protected fromInput(): number {
    return Math.floor(super.fromInput());
  }

  public validate(): ValidationError[] | undefined {
    const results = super.validate();
    if (results?.length) {
      return results;
    }

    if (typeof this.input === 'string' && !isInt(this.input)) {
      return [{ name: this.getName(), error: '整数の形式が正しくありません' }];
    }

    const num = this.fromInput();
    if (!Number.isSafeInteger(num)) {
      return [{ name: this.getName(), error: '有効な整数ではありません' }];
    }

    return undefined;
  }
}
