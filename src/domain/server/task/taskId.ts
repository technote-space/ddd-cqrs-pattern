import StringId from '$/shared/valueObject/stringId';

export default class TaskId extends StringId {
  public getName(): string {
    return 'タスクID';
  }
}
