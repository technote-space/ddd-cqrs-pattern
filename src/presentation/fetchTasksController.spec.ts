import type { TaskDto } from '^/usecase/task/taskDto';
import UserId from '$/server/user/valueObject/userId';
import { createRequest } from '^/__mocks__/request';
import FetchTasksController from './fetchTasksController';

describe('FetchTasksController', () => {
  it('タスク一覧を取得する', async () => {
    const userSession = { userId: UserId.create('user-id') };
    const mockGetUserSession = jest.fn(() => Promise.resolve(userSession));
    const mockInvoke = jest.fn(() => Promise.resolve([{
      id: 'task-id',
      taskName: 'name',
      memo: null,
      status: '登録',
      dueDate: null,
      estimateValue: null,
      estimateUnit: null,
      tags: [],
    }] as TaskDto[]));
    const controller = new FetchTasksController(
      {} as never,
      { getUserSession: mockGetUserSession },
      { invoke: mockInvoke } as never,
    );

    const result = await controller.invoke(createRequest({
      headers: {
        authorization: 'Bearer token',
      },
    }));

    expect(mockGetUserSession).toBeCalledWith('Bearer token');
    expect(mockInvoke).toBeCalledWith(userSession);
    expect(result.status).toBe(200);
  });
});
