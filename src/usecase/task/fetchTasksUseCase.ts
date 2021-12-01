import type Task from '$/server/task/task';
import type UserId from '$/server/user/valueObject/userId';
import type { FetchTasksUseCaseDto } from './fetchTasksUseCaseDto';
import type { UserSession } from '^/usecase/shared/userSession';
import { inject } from 'tsyringe';
import { fromEntity } from './fetchTasksUseCaseDto';

export interface ITaskQueryService {
  findByUser(userId: UserId): Promise<Task[]>;
}

export default class FetchTasksUseCase {
  public constructor(
    @inject('ITaskQueryService') private taskQueryService: ITaskQueryService,
  ) {
  }

  public async invoke(userSession: UserSession): Promise<FetchTasksUseCaseDto[]> {
    const tasks = await this.taskQueryService.findByUser(userSession.userId);
    return tasks.map(fromEntity);
  }
}
