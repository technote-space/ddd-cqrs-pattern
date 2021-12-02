import InvalidControl from '$/shared/exceptions/domain/invalidControl';
import Flags from '$/shared/valueObject/flags';

export default class Status extends Flags<'登録' | '実行中' | '完了' | '削除(登録)' | '削除(実行中)' | '削除(完了)'>() {
  protected get flagTypes(): ('登録' | '実行中' | '完了' | '削除(登録)' | '削除(実行中)' | '削除(完了)')[] {
    return ['登録', '実行中', '完了', '削除(登録)', '削除(実行中)', '削除(完了)'];
  }

  public getName(): string {
    return 'ステータス';
  }

  public canDelete(): boolean {
    return ['登録', '実行中', '完了'].includes(this.value);
  }

  public canRestore(): boolean {
    return !this.canDelete();
  }

  public onDelete(): Status | never {
    if (this.value === '登録') {
      return Status.create('削除(登録)');
    }

    if (this.value === '実行中') {
      return Status.create('削除(実行中)');
    }

    if (this.value === '完了') {
      return Status.create('削除(完了)');
    }

    throw new InvalidControl('すでに削除されています');
  }

  public onRestore(): Status | never {
    if (this.value === '削除(登録)') {
      return Status.create('登録');
    }

    if (this.value === '削除(実行中)') {
      return Status.create('実行中');
    }

    if (this.value === '削除(完了)') {
      return Status.create('完了');
    }

    throw new InvalidControl('削除されていません');
  }
}
