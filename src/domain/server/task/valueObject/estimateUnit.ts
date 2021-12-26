import Flags from '$/shared/valueObject/flags';

export default class EstimateUnit extends Flags<'日' | '時間'>() {
  public static getLabel(): string {
    return '作業見積単位';
  }

  protected get flagTypes(): ('日' | '時間')[] {
    return ['日', '時間'];
  }
}
