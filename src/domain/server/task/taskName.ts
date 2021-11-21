import Text from '$/shared/valueObject/text';

export default class TaskName extends Text {
  public getName(): string {
    return 'タスク名';
  }

  protected getValidationMaxLength(): number | undefined {
    return 64;
  }
}
