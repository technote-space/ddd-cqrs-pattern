import type Task from '$/server/task/task';
import type ITaskRepository from '$/server/task/taskRepository';
import UserId from '$/server/user/valueObject/userId';
import CreateTaskUseCase from './createTaskUseCase';

describe('CreateTaskUseCase', () => {
  it('新しくタスクを追加する', async () => {
    const mockSave = jest.fn((task: Task) => {
      task.taskId.setGeneratedId('taskId');
      return Promise.resolve();
    });
    const useCase = new CreateTaskUseCase({ save: mockSave } as never as ITaskRepository);

    const result = await useCase.invoke({ userId: UserId.create('test') }, {
      タスク名: 'task',
      メモ: 'memo',
      ステータス: '登録',
      期日: '2022-01-01T10:00:00+09:00',
      作業見積: 10,
      作業見積単位: '日',
      タグ: ['tag1', 'tag2'],
    });

    expect(mockSave).toBeCalledTimes(1);
    expect(result.id).toBe('taskId');
    expect(result.タスク名).toBe('task');
    expect(result.メモ).toBe('memo');
    expect(result.ステータス).toBe('登録');
    expect(result.期日).toBe('2022-01-01T01:00:00.000Z');
    expect(result.作業見積).toBe(10);
    expect(result.作業見積単位).toBe('日');
    expect(result.タグ).toEqual(['tag1', 'tag2']);
  });
});
