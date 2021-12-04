import type IDatabase from '$/server/shared/database';
import type Task from '$/server/task/task';
import type UserId from '$/server/user/valueObject/userId';
import type { DatabaseType } from './mapper';
import type { ITaskQueryService } from '^/usecase/task/fetchTasksUseCase';
import { inject, singleton } from 'tsyringe';
import Mapper from './mapper';

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
          property: 'ユーザー',
          condition: {
            relation: {
              contains: userId.value,
            },
          },
        },
      ],
      sort: {
        column: '期日',
        direction: 'descending',
      },
    });

    return response.results.map(result => Mapper.toEntity(result));
  }
}
