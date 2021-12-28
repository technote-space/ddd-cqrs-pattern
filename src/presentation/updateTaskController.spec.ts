import type { TaskDto } from '^/usecase/task/taskDto';
import TaskId from '$/server/task/valueObject/taskId';
import UserId from '$/server/user/valueObject/userId';
import { createRequest } from '^/__mocks__/request';
import UpdateTaskController from './updateTaskController';

describe('UpdateTaskUseCase', () => {
  it('タスクが更新される', async () => {
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
    const controller = new UpdateTaskController(
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
      query: {
        taskId: 'task-id',
      },
      headers: {
        authorization: 'Bearer token',
      },
      body,
    }));

    expect(mockGetUserSession).toBeCalledWith('Bearer token');
    expect(mockInvoke).toBeCalledWith(userSession, TaskId.create('task-id'), body);
    expect(result.status).toBe(200);
  });
});
