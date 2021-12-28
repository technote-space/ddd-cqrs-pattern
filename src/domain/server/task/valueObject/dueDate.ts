import Date from '$/shared/valueObject/date';

export default class DueDate extends Date {
  public static getLabel(): string {
    return '期日';
  }
}
