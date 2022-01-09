import type IDatabase from '$/server/shared/database';
import type ITaskRepository from '$/server/task/taskRepository';
import type Task from '$/shared/task/task';
import type TaskId from '$/shared/task/valueObject/taskId';
import type { DatabaseType } from './notionMapper';
import { inject, singleton } from 'tsyringe';
import NotFound from '$/shared/exceptions/domain/notFound';
import NotionMapper from './notionMapper';

@singleton()
export default class NotionTaskRepository implements ITaskRepository {
  public constructor(
    @inject('IDatabase') private database: IDatabase,
  ) {
  }

  public async findById(taskId: TaskId): Promise<Task> {
    const response = await this.database.find<DatabaseType>('tasks', taskId.value);
    if (!response) {
      throw new NotFound('タスク', 'tasks', taskId.value);
    }

    return NotionMapper.toEntity(response);
  }

  private async store(task: Task): Promise<DatabaseType> {
    const data = {
      taskName: task.taskName.value,
      status: task.status.value,
      tags: task.tags.collections.map(tag => tag.tagName.value),
      memo: task.memo?.value ?? null,
      user: task.userId.value,
      estimateValue: task.estimate?.value.value.value ?? null,
      estimateUnit: task.estimate?.value.unit.value ?? null,
      dueDate: task.dueDate?.value.toISOString() ?? null,
    };

    if (task.taskId.isSetId()) {
      return this.database.update<DatabaseType>('tasks', {
        id: task.taskId.value,
        ...data,
      });
    } else {
      return this.database.create<DatabaseType>('tasks', data);
    }
  }

  public async save(task: Task): Promise<Task> {
    return NotionMapper.toEntity(await this.store(task));
  }

  public async delete(taskId: TaskId): Promise<void> {
    await this.database.delete('tasks', taskId.value);
  }
}
