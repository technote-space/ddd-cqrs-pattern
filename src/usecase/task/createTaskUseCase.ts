import type ITaskRepository from '$/server/task/taskRepository';
import type { TaskDto } from './taskDto';
import type { UserSession } from '^/usecase/shared/userSession';
import { inject } from 'tsyringe';
import { toEntity, fromEntity } from './taskDto';

export default class CreateTaskUseCase {
  public constructor(
    @inject('ITaskRepository') private repository: ITaskRepository,
  ) {
  }

  public async invoke(userSession: UserSession, data: Omit<TaskDto, 'id'>) {
    const task = toEntity(userSession.userId, data);
    await this.repository.save(task);

    return fromEntity(task);
  }
}