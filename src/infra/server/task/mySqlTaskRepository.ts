import type ITaskRepository from '$/server/task/taskRepository';
import type Task from '$/shared/task/task';
import type TaskId from '$/shared/task/valueObject/taskId';
import type { TaskModel } from './mySqlMapper';
import type { PrismaClient, Prisma } from '@/server/shared/database/mysql';
import { inject, singleton } from 'tsyringe';
import NotFound from '$/shared/exceptions/domain/notFound';
import MySqlMapper from './mySqlMapper';

@singleton()
export default class MySqlTaskRepository implements ITaskRepository {
  public constructor(
    @inject('PrismaClient') private client: PrismaClient,
  ) {
  }

  public static getIncludeArgs() {
    return {
      user: {
        select: {
          id: true,
        },
      },
      tags: {
        select: {
          id: true,
          tagName: true,
        },
      },
    };
  }

  public async findById(taskId: TaskId): Promise<Task> {
    const task = await this.client.task.findFirst({
      where: {
        id: Number(taskId.value),
      },
      include: MySqlTaskRepository.getIncludeArgs(),
    });

    if (!task) {
      throw new NotFound('タスク', 'tasks', taskId.value);
    }

    return MySqlMapper.toEntity(task);
  }

  private async store(task: Task): Promise<TaskModel> {
    const data: Prisma.TaskCreateInput | Prisma.TaskUpdateInput = {
      taskName: task.taskName.value,
      memo: task.memo?.value ?? null,
      status: task.status.value,
      dueDate: task.dueDate?.value.toDate() ?? null,
      estimateValue: task.estimate?.value.value.value ?? null,
      estimateUnit: task.estimate?.value.unit.value ?? null,
      user: { connect: { id: Number(task.userId.value) } },
      tags: {
        connectOrCreate: task.tags.collections.map(tag => ({
          where: { tagName: tag.tagName.value },
          create: { tagName: tag.tagName.value },
        })),
      },
    };

    if (task.taskId.isSetId()) {
      data.tags = {
        ...data.tags,
        set: [],
      };
      return this.client.task.update({
        data,
        where: {
          id: Number(task.taskId.value),
        },
        include: MySqlTaskRepository.getIncludeArgs(),
      });
    } else {
      return this.client.task.create({
        data: data as Prisma.TaskCreateInput,
        include: MySqlTaskRepository.getIncludeArgs(),
      });
    }
  }

  public async save(task: Task): Promise<Task> {
    return MySqlMapper.toEntity(await this.store(task));
  }

  public async delete(taskId: TaskId): Promise<void> {
    await this.client.task.delete({ where: { id: Number(taskId.value) } });
  }
}
