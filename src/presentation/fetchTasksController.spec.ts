import type FetchTasksUseCase from '^/usecase/task/fetchTasksUseCase';
import type { TaskDto } from '^/usecase/task/taskDto';
import UserId from '$/server/user/valueObject/userId';
import FetchTasksController from './fetchTasksController';

describe('FetchTasksController', () => {
  it('タスク一覧を取得する', async () => {
    const userSession = { userId: UserId.create('user-id') };
    const mockGetUserSession = jest.fn(() => Promise.resolve(userSession));
    const mockInvoke = jest.fn(() => Promise.resolve([{
      id: 'task-id',
      タスク名: 'name',
      メモ: null,
      ステータス: '登録',
      期日: null,
      作業見積: null,
      作業見積単位: null,
      タグ: [],
    }] as TaskDto[]));
    const controller = new FetchTasksController(
      { getUserSession: mockGetUserSession },
      { invoke: mockInvoke } as never as FetchTasksUseCase,
    );

    const result = await controller.invoke({
      headers: {
        authorization: 'Bearer token',
      },
    });

    expect(mockGetUserSession).toBeCalledWith('Bearer token');
    expect(mockInvoke).toBeCalledWith(userSession);
    expect(result.status).toBe(200);
  });
});
