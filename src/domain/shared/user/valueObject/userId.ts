import StringId from '$/shared/valueObject/stringId';

export default class UserId extends StringId {
  public static getLabel(): string {
    return 'ユーザーID';
  }
}
