import StringId from '$/shared/valueObject/stringId';

export default class TaskId extends StringId {
  public static getLabel(): string {
    return 'タスクID';
  }
}
