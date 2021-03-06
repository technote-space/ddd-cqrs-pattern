import type IDatabase from '$/server/shared/database';
import type Task from '$/shared/task/task';
import type UserId from '$/shared/user/valueObject/userId';
import type { DatabaseType } from './notionMapper';
import type { ITaskQueryService } from '^/usecase/task/fetchTasksUseCase';
import { inject, singleton } from 'tsyringe';
import NotionMapper from './notionMapper';

@singleton()
export default class NotionTaskQueryService implements ITaskQueryService {
  public constructor(
    @inject('IDatabase') private database: IDatabase,
  ) {
  }

  public async findByUser(userId: UserId): Promise<Task[]> {
    const response = await this.database.search<DatabaseType>('tasks', {
      filter: [
        {
          property: 'user',
          condition: {
            relation: {
              contains: userId.value,
            },
          },
        },
      ],
    });

    return response.results.map(result => NotionMapper.toEntity(result)).sort((a, b) => a.compare(b));
  }
}
