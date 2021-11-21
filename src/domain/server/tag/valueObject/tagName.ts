import Text from '$/shared/valueObject/text';

export default class TagName extends Text {
  public getName(): string {
    return 'タグ名';
  }

  protected getValidationMaxLength(): number | undefined {
    return 16;
  }
}
