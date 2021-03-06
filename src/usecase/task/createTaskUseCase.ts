import type ITaskRepository from '$/server/task/taskRepository';
import type { TaskDto } from './taskDto';
import type { UserSession } from '^/usecase/shared/userSession';
import { inject, singleton } from 'tsyringe';
import { toEntity, fromEntity } from './taskDto';

export type CreateData = Omit<TaskDto, 'id'>;

@singleton()
export default class CreateTaskUseCase {
  public constructor(
    @inject('ITaskRepository') private repository: ITaskRepository,
  ) {
  }

  public async invoke(userSession: UserSession, data: CreateData) {
    return fromEntity(await this.repository.save(toEntity(userSession.userId, data)));
  }
}
