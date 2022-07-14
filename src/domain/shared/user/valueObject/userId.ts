import StringId from '@technote-space/vo-entity-ts/dist/valueObject/stringId';

export default class UserId extends StringId {
  protected get symbol() {
    return Symbol();
  }

  public static getLabel(): string {
    return 'ユーザーID';
  }
}
