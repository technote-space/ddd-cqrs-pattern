import Date from '$/shared/valueObject/date';

export default class DueDate extends Date {
  public getName(): string {
    return '期日';
  }
}
