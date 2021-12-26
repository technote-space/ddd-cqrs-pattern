import Text from '$/shared/valueObject/text';

export default class Memo extends Text {
  public static getLabel(): string {
    return 'メモ';
  }

  protected getValidationMaxLength(): number | undefined {
    return 1000;
  }
}
