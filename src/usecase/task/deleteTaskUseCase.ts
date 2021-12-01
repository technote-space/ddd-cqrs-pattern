import type ITaskRepository from '$/server/task/taskRepository';
import type TaskId from '$/server/task/valueObject/taskId';
import type { UserSession } from '^/usecase/shared/userSession';
import { inject } from 'tsyringe';
import Forbidden from '$/shared/exceptions/forbidden';
import { fromEntity } from '^/usecase/task/taskDto';

export default class DeleteTaskUseCase {
  public constructor(
    @inject('ITaskRepository') private repository: ITaskRepository,
  ) {
  }

  public async invoke(userSession: UserSession, taskId: TaskId) {
    const task = await this.repository.findById(taskId);
    if (!task.userId.equals(userSession.userId)) {
      throw new Forbidden();
    }

    await this.repository.delete(task.taskId);
    return fromEntity(task);
  }
}
