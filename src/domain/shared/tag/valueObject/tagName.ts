import Text from '@technote-space/vo-entity-ts/dist/valueObject/text';

export default class TagName extends Text {
  protected get symbol() {
    return Symbol();
  }

  public static getLabel(): string {
    return 'タグ';
  }

  protected getValidationMaxLength(): number | undefined {
    return 16;
  }
}
