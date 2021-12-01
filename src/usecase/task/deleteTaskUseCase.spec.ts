import type ITaskRepository from '$/server/task/taskRepository';
import Tags from '$/server/tag/tags';
import Task from '$/server/task/task';
import Status from '$/server/task/valueObject/status';
import TaskId from '$/server/task/valueObject/taskId';
import TaskName from '$/server/task/valueObject/taskName';
import UserId from '$/server/user/valueObject/userId';
import DeleteTaskUseCase from './deleteTaskUseCase';

describe('DeleteTaskUseCase', () => {
  it('タスクを削除する', async () => {
    const findByIdMock = jest.fn(() => Promise.resolve(Task.reconstruct(
      TaskId.create('taskId'),
      TaskName.create('task'),
      null,
      Status.create('登録'),
      null,
      null,
      UserId.create('test'),
      Tags.create([]),
    )));
    const deleteMock = jest.fn(() => Promise.resolve());
    const useCase = new DeleteTaskUseCase({ findById: findByIdMock, delete: deleteMock } as never as ITaskRepository);

    const result = await useCase.invoke({ userId: UserId.create('test') }, TaskId.create('taskId'));

    expect(findByIdMock).toBeCalledTimes(1);
    expect(deleteMock).toBeCalledTimes(1);
    expect(result.id).toBe('taskId');
    expect(result.タスク名).toBe('task');
    expect(result.メモ).toBeNull();
    expect(result.ステータス).toBe('登録');
    expect(result.期日).toBeNull();
    expect(result.作業見積).toBeNull();
    expect(result.作業見積単位).toBeNull();
    expect(result.タグ).toEqual([]);
  });

  it('異なるユーザーのタスクを削除しようとするとエラー', async () => {
    const findByIdMock = jest.fn(() => Promise.resolve(Task.reconstruct(
      TaskId.create('taskId'),
      TaskName.create('task'),
      null,
      Status.create('登録'),
      null,
      null,
      UserId.create('test'),
      Tags.create([]),
    )));
    const deleteMock = jest.fn(() => Promise.resolve());
    const useCase = new DeleteTaskUseCase({ findById: findByIdMock, delete: deleteMock } as never as ITaskRepository);

    await expect(useCase.invoke({ userId: UserId.create('test2') }, TaskId.create('taskId'))).rejects.toThrow('Forbidden');

    expect(findByIdMock).toBeCalledTimes(1);
    expect(deleteMock).not.toBeCalled();
  });
});
