import InvalidControl from '$/shared/exceptions/domain/invalidControl';
import Flags from '$/shared/valueObject/flags';

type StatusTypes = '登録' | '実行中' | '完了' | '削除(登録)' | '削除(実行中)' | '削除(完了)';
export default class Status extends Flags<StatusTypes>() {
  private static orders = Object.assign({}, ...[
    '実行中', '登録', '完了', '削除(実行中)', '削除(登録)', '削除(完了)',
  ].map((status, index) => ({ [status]: status.startsWith('削除') ? 10 : index })));

  public get flagTypes(): StatusTypes[] {
    return ['登録', '実行中', '完了', '削除(登録)', '削除(実行中)', '削除(完了)'];
  }

  public static getLabel(): string {
    return 'ステータス';
  }

  public static getActiveStatuses() {
    return ['登録', '実行中', '完了'];
  }

  public static getAllStatuses() {
    return ['登録', '実行中', '完了', Status.deleteLabel()];
  }

  public canDelete(): boolean {
    return Status.getActiveStatuses().includes(this.value);
  }

  public canRestore(): boolean {
    return !this.canDelete();
  }

  public isDeleted(): boolean {
    return this.canRestore();
  }

  public static deleteLabel(): string {
    return '削除';
  }

  public static ActiveLabel(): string {
    return 'ALL';
  }

  public isEqualLabelStatus(status: string): boolean {
    if (status === Status.ActiveLabel()) return !this.isDeleted();
    if (status === '削除') return this.isDeleted();
    return status === this.value;
  }

  public get displayValue(): string {
    return this.canRestore() ? Status.deleteLabel() : this.value;
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

    throw new InvalidControl('復元できないステータスです');
  }

  public compare(value: this): number {
    if (this.value === value.value) {
      return 0;
    }

    return Math.max(-1, Math.min(1, Status.orders[this.value] - Status.orders[value.value]));
  }

  public isAscendStatus(): boolean {
    return ['登録', '実行中'].includes(this.value);
  }
}
