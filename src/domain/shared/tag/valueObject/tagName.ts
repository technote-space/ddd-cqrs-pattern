import Text from '$/shared/valueObject/text';

export default class TagName extends Text {
  public static getLabel(): string {
    return 'タグ';
  }

  protected getValidationMaxLength(): number | undefined {
    return 16;
  }
}
