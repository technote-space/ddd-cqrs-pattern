import type Task from '$/shared/task/task';
import type UserId from '$/shared/user/valueObject/userId';
import type { PrismaClient } from '@/server/shared/database/mysql';
import type { ITaskQueryService } from '^/usecase/task/fetchTasksUseCase';
import { inject, singleton } from 'tsyringe';
import MySqlTaskRepository from '@/server/task/mySqlTaskRepository';
import MySqlMapper from './mySqlMapper';

@singleton()
export default class MySqlTaskQueryService implements ITaskQueryService {
  public constructor(
    @inject('PrismaClient') private client: PrismaClient,
  ) {
  }

  public async findByUser(userId: UserId): Promise<Task[]> {
    const tasks = await this.client.task.findMany({
      where: {
        userId: Number(userId.value),
      },
      include: MySqlTaskRepository.getIncludeArgs(),
    });

    return tasks.map(task => MySqlMapper.toEntity(task)).sort((a, b) => a.compare(b));
  }
}
