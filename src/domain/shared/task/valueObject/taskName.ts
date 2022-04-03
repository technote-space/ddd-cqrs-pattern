import Text from '@technote-space/vo-entity-ts/dist/valueObject/text';

export default class TaskName extends Text {
  protected get symbol() {
    return Symbol();
  }

  public static getLabel(): string {
    return 'タスク名';
  }

  protected getValidationMaxLength(): number | undefined {
    return 64;
  }
}
