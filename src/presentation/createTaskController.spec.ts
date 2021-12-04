import type CreateTaskUseCase from '^/usecase/task/createTaskUseCase';
import type { TaskDto } from '^/usecase/task/taskDto';
import UserId from '$/server/user/valueObject/userId';
import CreateTaskController from './createTaskController';

describe('CreateTaskController', () => {
  it('タスクが作成される', async () => {
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
    const controller = new CreateTaskController(
      { getUserSession: mockGetUserSession },
      { invoke: mockInvoke } as never as CreateTaskUseCase,
    );
    const body = {
      タスク名: 'name',
      メモ: null,
      ステータス: '登録',
      期日: null,
      作業見積: null,
      作業見積単位: null,
      タグ: [],
    };

    const result = await controller.invoke({
      headers: {
        authorization: 'Bearer token',
      },
      body,
    });

    expect(mockGetUserSession).toBeCalledWith('Bearer token');
    expect(mockInvoke).toBeCalledWith(userSession, body);
    expect(result.status).toBe(201);
  });
});
