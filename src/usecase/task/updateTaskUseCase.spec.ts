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
      taskName: 'task',
      memo: null,
      status: '登録',
      dueDate: null,
      estimateValue: null,
      estimateUnit: null,
      tags: [],
    });

    expect(mockFindById).toBeCalledTimes(1);
    expect(mockSave).toBeCalledTimes(1);
    expect(result.id).toBe('taskId');
    expect(result.taskName).toBe('task');
    expect(result.memo).toBeNull();
    expect(result.status).toBe('登録');
    expect(result.dueDate).toBeNull();
    expect(result.estimateValue).toBeNull();
    expect(result.estimateUnit).toBeNull();
    expect(result.tags).toEqual([]);
  });

  it('異なるユーザーのタスクを更新しようとするとエラー', async () => {
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
    const mockRestore = jest.fn(() => Promise.resolve());
    const useCase = new UpdateTaskUseCase({ findById: mockFindById, restore: mockRestore } as never);

    await expect(useCase.invoke({ userId: UserId.create('test2') }, TaskId.create('taskId'), {} as never)).rejects.toThrow('Forbidden');

    expect(mockFindById).toBeCalledTimes(1);
    expect(mockRestore).not.toBeCalled();
  });
});
