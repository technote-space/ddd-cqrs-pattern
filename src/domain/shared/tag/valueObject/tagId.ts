import StringId from '@technote-space/vo-entity-ts/dist/valueObject/stringId';

export default class TagId extends StringId {
  protected get symbol() {
    return Symbol();
  }

  public static getLabel(): string {
    return 'タグID';
  }
}
