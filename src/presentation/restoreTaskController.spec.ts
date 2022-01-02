import type { TaskDto } from '^/usecase/task/taskDto';
import TaskId from '$/server/task/valueObject/taskId';
import UserId from '$/server/user/valueObject/userId';
import { createRequest } from '^/__mocks__/request';
import RestoreTaskController from './restoreTaskController';

describe('RestoreTaskController', () => {
  it('タスクが復元される', async () => {
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
    const controller = new RestoreTaskController(
      {} as never,
      { getUserSession: mockGetUserSession },
      { invoke: mockInvoke } as never,
    );

    const result = await controller.invoke(createRequest({
      query: {
        taskId: 'task-id',
      },
      headers: {
        authorization: 'Bearer token',
      },
    }));

    expect(mockGetUserSession).toBeCalledWith('Bearer token');
    expect(mockInvoke).toBeCalledWith(userSession, TaskId.create('task-id'));
    expect(result.status).toBe(200);
  });
});
