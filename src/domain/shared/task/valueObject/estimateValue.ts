import Int from '@technote-space/vo-entity-ts/dist/valueObject/int';

export default class EstimateValue extends Int {
  protected get symbol() {
    return Symbol();
  }

  public static getLabel(): string {
    return '作業見積値';
  }

  protected getMinNumber(): number | undefined {
    return 1;
  }
}
