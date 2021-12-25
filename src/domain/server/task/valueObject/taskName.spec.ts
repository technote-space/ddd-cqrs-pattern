import TaskName from './taskName';

describe('TaskName', () => {
  it('名前が「タスク名」', () => {
    expect(TaskName.create('test').getName()).toBe('タスク名');
  });

  it('長さが 64 より長いとエラー', () => {
    expect(TaskName.create('a'.repeat(64)).validate()).toEqual([]);
    expect(TaskName.create('a'.repeat(65)).validate()).toEqual([{ name: 'タスク名', error: '64文字より短く入力してください' }]);
  });
});
