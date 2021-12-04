import type DeleteTaskUseCase from '^/usecase/task/deleteTaskUseCase';
import type { TaskDto } from '^/usecase/task/taskDto';
import TaskId from '$/server/task/valueObject/taskId';
import UserId from '$/server/user/valueObject/userId';
import DeleteTaskController from './deleteTaskController';

describe('DeleteTaskController', () => {
  it('タスクが削除される', async () => {
    const userSession = { userId: UserId.create('user-id') };
    const mockGetUserSession = jest.fn(() => Promise.resolve(userSession));
    const mockInvoke = jest.fn(() => Promise.resolve({
      id: 'task-id',
      タスク名: 'name',
      メモ: null,
      ステータス: '登録',
      期日: null,
      作業見積: null,
      作業見積単位: null,
      タグ: [],
    } as TaskDto));
    const controller = new DeleteTaskController(
      { getUserSession: mockGetUserSession },
      { invoke: mockInvoke } as never as DeleteTaskUseCase,
    );

    const result = await controller.invoke({
      query: {
        taskId: 'task-id',
      },
      headers: {
        authorization: 'Bearer token',
      },
    });

    expect(mockGetUserSession).toBeCalledWith('Bearer token');
    expect(mockInvoke).toBeCalledWith(userSession, TaskId.create('task-id'));
    expect(result.status).toBe(200);
  });
});