import TaskId from './taskId';

describe('TaskId', () => {
  it('名前が「タスクID」', () => {
    expect(TaskId.create('test').getName()).toBe('タスクID');
  });
});
