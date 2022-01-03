import type Task from '$/shared/task/task';
import type UserId from '$/shared/user/valueObject/userId';
import type { TaskDto } from './taskDto';
import type { UserSession } from '^/usecase/shared/userSession';
import { inject, singleton } from 'tsyringe';
import { fromEntity } from './taskDto';

export interface ITaskQueryService {
  findByUser(userId: UserId): Promise<Task[]>;
}

@singleton()
export default class FetchTasksUseCase {
  public constructor(
    @inject('ITaskQueryService') private taskQueryService: ITaskQueryService,
  ) {
  }

  public async invoke(userSession: UserSession): Promise<TaskDto[]> {
    const tasks = await this.taskQueryService.findByUser(userSession.userId);
    return tasks.map(fromEntity);
  }
}
