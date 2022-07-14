import Flags from '@technote-space/vo-entity-ts/dist/valueObject/flags';

export default class EstimateUnit extends Flags<'日' | '時間'> {
  protected get symbol() {
    return Symbol();
  }

  public static getLabel(): string {
    return '作業見積単位';
  }

  public get flagTypes(): ('日' | '時間')[] {
    return ['日', '時間'];
  }
}
