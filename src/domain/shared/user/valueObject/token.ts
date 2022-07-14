import StringId from '@technote-space/vo-entity-ts/dist/valueObject/stringId';

export default class Token extends StringId {
  protected get symbol() {
    return Symbol();
  }

  public static getLabel(): string {
    return 'ユーザー識別子';
  }
}
