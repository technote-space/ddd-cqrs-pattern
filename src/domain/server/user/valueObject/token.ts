import StringId from '$/shared/valueObject/stringId';

export default class Token extends StringId {
  public getName(): string {
    return 'ユーザー識別子';
  }
}
