import InvalidControl from '$/shared/exceptions/domain/invalidControl';
import Flags from '$/shared/valueObject/flags';

type StatusTypes = '登録' | '実行中' | '完了' | '削除(登録)' | '削除(実行中)' | '削除(完了)';
export default class Status extends Flags<StatusTypes>() {
  public get flagTypes(): StatusTypes[] {
    return ['登録', '実行中', '完了', '削除(登録)', '削除(実行中)', '削除(完了)'];
  }

  public static getLabel(): string {
    return 'ステータス';
  }

  public canDelete(): boolean {
    return ['登録', '実行中', '完了'].includes(this.value);
  }

  public canRestore(): boolean {
    return !this.canDelete();
  }

  public get displayValue(): string {
    return this.canRestore() ? '削除' : this.value;
  }

  public canDeleteCompletely(): boolean {
    return this.canRestore();
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

  public compare(value: this): number {
    if (this.value === value.value) {
      return 0;
    }

    const orders = Object.assign({}, ...[
      '実行中', '登録', '完了', '削除(実行中)', '削除(登録)', '削除(完了)',
    ].map((status, index) => ({ [status]: index })));
    return Math.max(-1, Math.min(1, orders[this.value] - orders[value.value]));
  }

  public isAscendStatus(): boolean {
    return ['登録', '実行中'].includes(this.value);
  }
}
