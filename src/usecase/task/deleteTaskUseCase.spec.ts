import Tags from '$/server/tag/tags';
import Task from '$/server/task/task';
import Status from '$/server/task/valueObject/status';
import TaskId from '$/server/task/valueObject/taskId';
import TaskName from '$/server/task/valueObject/taskName';
import UserId from '$/server/user/valueObject/userId';
import DeleteTaskUseCase from './deleteTaskUseCase';

describe('DeleteTaskUseCase', () => {
  it('タスクを削除する', async () => {
    const mockFindById = jest.fn(() => Promise.resolve(Task.reconstruct(
      TaskId.create('taskId'),
      TaskName.create('task'),
      null,
      Status.create('削除(登録)'),
      null,
      null,
      UserId.create('test'),
      Tags.create([]),
    )));
    const mockDelete = jest.fn(() => Promise.resolve());
    const useCase = new DeleteTaskUseCase({ findById: mockFindById, delete: mockDelete } as never);

    const result = await useCase.invoke({ userId: UserId.create('test') }, TaskId.create('taskId'));

    expect(mockFindById).toBeCalledTimes(1);
    expect(mockDelete).toBeCalledTimes(1);
    expect(result.id).toBe('taskId');
    expect(result.taskName).toBe('task');
    expect(result.memo).toBeNull();
    expect(result.status).toBe('削除(登録)');
    expect(result.dueDate).toBeNull();
    expect(result.estimateValue).toBeNull();
    expect(result.estimateUnit).toBeNull();
    expect(result.tags).toEqual([]);
  });

  it('異なるユーザーのタスクを削除しようとするとエラー', async () => {
    const mockFindById = jest.fn(() => Promise.resolve(Task.reconstruct(
      TaskId.create('taskId'),
      TaskName.create('task'),
      null,
      Status.create('削除(登録)'),
      null,
      null,
      UserId.create('test'),
      Tags.create([]),
    )));
    const mockDelete = jest.fn(() => Promise.resolve());
    const useCase = new DeleteTaskUseCase({ findById: mockFindById, delete: mockDelete } as never);

    await expect(useCase.invoke({ userId: UserId.create('test2') }, TaskId.create('taskId'))).rejects.toThrow('Forbidden');

    expect(mockFindById).toBeCalledTimes(1);
    expect(mockDelete).not.toBeCalled();
  });

  it('削除できないステータスのタスクを削除しようとするとエラー', async () => {
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
    const mockDelete = jest.fn(() => Promise.resolve());
    const useCase = new DeleteTaskUseCase({ findById: mockFindById, delete: mockDelete } as never);

    await expect(useCase.invoke({ userId: UserId.create('test') }, TaskId.create('taskId'))).rejects.toThrow('その操作は許可されていません');

    expect(mockFindById).toBeCalledTimes(1);
    expect(mockDelete).not.toBeCalled();
  });
});
