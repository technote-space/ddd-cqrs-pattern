import type Task from '$/shared/task/task';
import UserId from '$/shared/user/valueObject/userId';
import CreateTaskUseCase from './createTaskUseCase';

describe('CreateTaskUseCase', () => {
  it('新しくタスクを追加する', async () => {
    const mockSave = jest.fn((task: Task) => {
      const saved = task.copy();
      saved.taskId.setGeneratedId('taskId');
      return Promise.resolve(saved);
    });
    const useCase = new CreateTaskUseCase({ save: mockSave } as never);

    const result = await useCase.invoke({ userId: UserId.create('test') }, {
      taskName: 'task',
      memo: 'memo',
      status: '登録',
      dueDate: '2022-01-01T10:00:00+09:00',
      estimateValue: 10,
      estimateUnit: '日',
      tags: ['tag1', 'tag2'],
    });

    expect(mockSave).toBeCalledTimes(1);
    expect(result.id).toBe('taskId');
    expect(result.taskName).toBe('task');
    expect(result.memo).toBe('memo');
    expect(result.status).toBe('登録');
    expect(result.dueDate).toBe('2022-01-01T01:00:00.000Z');
    expect(result.estimateValue).toBe(10);
    expect(result.estimateUnit).toBe('日');
    expect(result.tags).toEqual(['tag1', 'tag2']);
  });
});
