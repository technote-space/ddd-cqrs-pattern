import type ITaskRepository from '$/server/task/taskRepository';
import type TaskId from '$/server/task/valueObject/taskId';
import type { TaskDto } from './taskDto';
import type { UserSession } from '^/usecase/shared/userSession';
import { inject } from 'tsyringe';
import { toEntity, fromEntity } from './taskDto';

export default class UpdateTaskUseCase {
  public constructor(
    @inject('ITaskRepository') private repository: ITaskRepository,
  ) {
  }

  public async invoke(userSession: UserSession, taskId: TaskId, data: Omit<TaskDto, 'id'>) {
    const task = toEntity(userSession.userId, data, taskId);
    await this.repository.save(task);

    return fromEntity(task);
  }
}
