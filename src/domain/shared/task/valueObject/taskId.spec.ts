import TaskId from './taskId';

describe('TaskId', () => {
  it('ラベルが「タスクID」', () => {
    expect(TaskId.getLabel()).toBe('タスクID');
  });
});
