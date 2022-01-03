import StringId from '$/shared/valueObject/stringId';

export default class Token extends StringId {
  public static getLabel(): string {
    return 'ユーザー識別子';
  }
}
