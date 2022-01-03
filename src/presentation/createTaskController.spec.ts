import type { TaskDto } from '^/usecase/task/taskDto';
import UserId from '$/shared/user/valueObject/userId';
import { createRequest } from '^/__mocks__/request';
import CreateTaskController from './createTaskController';

describe('CreateTaskController', () => {
  it('タスクが作成される', async () => {
    const userSession = { userId: UserId.create('user-id') };
    const mockGetUserSession = jest.fn(() => Promise.resolve(userSession));
    const mockInvoke = jest.fn(() => Promise.resolve({
      id: 'task-id',
      taskName: 'name',
      memo: null,
      status: '登録',
      dueDate: null,
      estimateValue: null,
      estimateUnit: null,
      tags: [],
    } as TaskDto));
    const controller = new CreateTaskController(
      {} as never,
      { getUserSession: mockGetUserSession },
      { invoke: mockInvoke } as never,
    );
    const body = {
      taskName: 'name',
      memo: null,
      status: '登録',
      dueDate: null,
      estimateValue: null,
      estimateUnit: null,
      tags: [],
    };

    const result = await controller.invoke(createRequest({
      headers: {
        authorization: 'Bearer token',
      },
      body,
    }));

    expect(mockGetUserSession).toBeCalledWith('Bearer token');
    expect(mockInvoke).toBeCalledWith(userSession, body);
    expect(result.status).toBe(201);
  });
});
