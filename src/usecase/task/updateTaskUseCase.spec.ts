import Tags from '$/server/tag/tags';
import Task from '$/server/task/task';
import Status from '$/server/task/valueObject/status';
import TaskId from '$/server/task/valueObject/taskId';
import TaskName from '$/server/task/valueObject/taskName';
import UserId from '$/server/user/valueObject/userId';
import UpdateTaskUseCase from './updateTaskUseCase';

describe('UpdateTaskUseCase', () => {
  it('タスクを更新する', async () => {
    const mockFindById = jest.fn(() => Promise.resolve(Task.reconstruct(
      TaskId.create('taskId'),
      TaskName.create('task'),
      null,
      Status.create('登録'),
      null,
      null,
      UserId.create('test'),
      Tags.create([]),
    )));
    const mockSave = jest.fn(() => Promise.resolve());
    const useCase = new UpdateTaskUseCase({ findById: mockFindById, save: mockSave } as never);

    const result = await useCase.invoke({ userId: UserId.create('test') }, TaskId.create('taskId'), {
      タスク名: 'task',
      メモ: null,
      ステータス: '登録',
      期日: null,
      作業見積値: null,
      作業見積単位: null,
      タグ: [],
    });

    expect(mockFindById).toBeCalledTimes(1);
    expect(mockSave).toBeCalledTimes(1);
    expect(result.id).toBe('taskId');
    expect(result.タスク名).toBe('task');
    expect(result.メモ).toBeNull();
    expect(result.ステータス).toBe('登録');
    expect(result.期日).toBeNull();
    expect(result.作業見積値).toBeNull();
    expect(result.作業見積単位).toBeNull();
    expect(result.タグ).toEqual([]);
  });
});
