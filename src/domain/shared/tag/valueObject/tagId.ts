import StringId from '$/shared/valueObject/stringId';

export default class TagId extends StringId {
  public static getLabel(): string {
    return 'タグID';
  }
}
