import StringId from '@technote-space/vo-entity-ts/dist/valueObject/stringId';

export default class TaskId extends StringId {
  protected get symbol() {
    return Symbol();
  }

  public static getLabel(): string {
    return 'タスクID';
  }
}
