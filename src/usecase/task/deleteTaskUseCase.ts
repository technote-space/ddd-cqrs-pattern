import type ITaskRepository from '$/server/task/taskRepository';
import type TaskId from '$/server/task/valueObject/taskId';
import type { UserSession } from '^/usecase/shared/userSession';
import { inject, singleton } from 'tsyringe';
import InvalidControl from '$/shared/exceptions/domain/invalidControl';
import Forbidden from '$/shared/exceptions/http/forbidden';
import { fromEntity } from '^/usecase/task/taskDto';

@singleton()
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

    if (!task.canDelete()) {
      throw new InvalidControl('削除できないステータスです');
    }

    await this.repository.delete(task.taskId);
    return fromEntity(task);
  }
}
