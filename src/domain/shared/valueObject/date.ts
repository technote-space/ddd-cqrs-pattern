import dayjs from 'dayjs';
import isDate from 'validator/lib/isDate';
import Base from './base';

// Inner type = string: consider serialization
export default abstract class Date extends Base<dayjs.ConfigType, dayjs.Dayjs, string>() {
  protected fromInput(): string {
    return dayjs(this.input).toISOString();
  }

  protected toOutput(): dayjs.Dayjs {
    return dayjs(this.inner);
  }

  public validate(): string[] | undefined {
    if (typeof this.input === 'string' && !isDate(this.input)) {
      return ['日付の形式が正しくありません'];
    }

    return undefined;
  }

  public compare(value: this): number {
    if (this.value.isSame(value.value)) {
      return 0;
    }

    if (this.value.isBefore(value.value)) {
      return -1;
    }

    return 1;
  }
}
