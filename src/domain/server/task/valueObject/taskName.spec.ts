import TaskName from './taskName';

describe('TaskName', () => {
  it('ラベルが「タスク名」', () => {
    expect(TaskName.getLabel()).toBe('タスク名');
  });

  it('長さが 64 より長いとエラー', () => {
    expect(TaskName.create('a'.repeat(64)).validate('taskName')).toEqual([]);
    expect(TaskName.create('a'.repeat(65)).validate('taskName')).toEqual([{ name: 'taskName', error: '64文字より短く入力してください' }]);
  });
});
