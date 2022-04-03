import Date from '@technote-space/vo-entity-ts/dist/valueObject/date';

export default class DueDate extends Date {
  protected get symbol() {
    return Symbol();
  }

  public static getLabel(): string {
    return '期日';
  }
}
