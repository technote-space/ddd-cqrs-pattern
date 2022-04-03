import Text from '@technote-space/vo-entity-ts/dist/valueObject/text';

export default class Memo extends Text {
  protected get symbol() {
    return Symbol();
  }

  public static getLabel(): string {
    return 'メモ';
  }

  protected getValidationMaxLength(): number | undefined {
    return 1000;
  }
}
