import Int from '$/shared/valueObject/int';

export default class EstimateValue extends Int {
  public static getLabel(): string {
    return '作業見積値';
  }

  protected getMinNumber(): number | undefined {
    return 1;
  }
}
