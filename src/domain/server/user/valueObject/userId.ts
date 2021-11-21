import StringId from '$/shared/valueObject/stringId';

export default class UserId extends StringId {
  public getName(): string {
    return 'ユーザーID';
  }
}
