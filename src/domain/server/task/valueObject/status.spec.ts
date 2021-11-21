import Status from './status';

describe('Status', () => {
  it('名前が「ステータス」', () => {
    expect(Status.create('登録').getName()).toBe('ステータス');
  });

  it('「登録」「実行中」「完了」のときのみ削除可能', () => {
    // 削除可能
    expect(Status.create('登録').canDelete()).toBe(true);
    expect(Status.create('実行中').canDelete()).toBe(true);
    expect(Status.create('完了').canDelete()).toBe(true);

    // 削除不可
    expect(Status.create('削除(登録)').canDelete()).toBe(false);
    expect(Status.create('削除(実行中)').canDelete()).toBe(false);
    expect(Status.create('削除(完了)').canDelete()).toBe(false);
  });

  it('「削除(登録)」「削除(実行中)」「削除(完了)」のときのみリストア可能', () => {
    // リストア可能
    expect(Status.create('削除(登録)').canRestore()).toBe(true);
    expect(Status.create('削除(実行中)').canRestore()).toBe(true);
    expect(Status.create('削除(完了)').canRestore()).toBe(true);

    // リストア不可
    expect(Status.create('登録').canRestore()).toBe(false);
    expect(Status.create('実行中').canRestore()).toBe(false);
    expect(Status.create('完了').canRestore()).toBe(false);
  });

  it('「登録」時に削除すると「削除(登録)」になる', () => {
    const deleted = Status.create('登録').onDelete();
    expect(deleted.value).toBe('削除(登録)');
  });

  it('「実行中」時に削除すると「削除(実行中)」になる', () => {
    const deleted = Status.create('実行中').onDelete();
    expect(deleted.value).toBe('削除(実行中)');
  });

  it('「完了」時に削除すると「削除(完了)」になる', () => {
    const deleted = Status.create('完了').onDelete();
    expect(deleted.value).toBe('削除(完了)');
  });

  it('「登録」「実行中」「完了」以外で削除するとエラーになる', () => {
    expect(() => Status.create('削除(登録)').onDelete()).toThrow('その操作は許可されていません');
  });

  it('「削除(登録)」時にリストアすると「登録」になる', () => {
    const restored = Status.create('削除(登録)').onRestore();
    expect(restored.value).toBe('登録');
  });

  it('「削除(実行中)」時にリストアすると「実行中」になる', () => {
    const restored = Status.create('削除(実行中)').onRestore();
    expect(restored.value).toBe('実行中');
  });

  it('「削除(完了)」時にリストアすると「完了」になる', () => {
    const restored = Status.create('削除(完了)').onRestore();
    expect(restored.value).toBe('完了');
  });

  it('「削除(登録)」「削除(実行中)」「削除(完了)」以外でリストアするとエラーになる', () => {
    expect(() => Status.create('登録').onRestore()).toThrow('その操作は許可されていません');
  });
});
