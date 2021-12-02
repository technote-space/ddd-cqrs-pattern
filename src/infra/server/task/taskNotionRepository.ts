import type IDatabase from '$/server/shared/database';
import type { CreateData } from '$/server/shared/database';
import type Task from '$/server/task/task';
import type ITaskRepository from '$/server/task/taskRepository';
import type TaskId from '$/server/task/valueObject/taskId';
import type { DatabaseType } from './mapper';
import { inject, singleton } from 'tsyringe';
import NotFound from '$/shared/exceptions/domain/notFound';
import Mapper from './mapper';

@singleton()
export default class TaskNotionRepository implements ITaskRepository {
  public constructor(
    @inject('IDatabase') private database: IDatabase,
  ) {
  }

  public async findById(taskId: TaskId): Promise<Task> {
    const response = await this.database.find<DatabaseType>('tasks', taskId.value);
    if (!response) {
      throw new NotFound('タスク', 'tasks', taskId.value);
    }

    return Mapper.toEntity(response);
  }

  private async store(task: Task, data: CreateData): Promise<DatabaseType> {
    if (task.taskId.isSetId()) {
      return this.database.update<DatabaseType>('tasks', {
        id: task.taskId.value,
        ...data,
      });
    } else {
      const result = await this.database.create<DatabaseType>('tasks', data);
      task.taskId.setGeneratedId(result.id);
      return result;
    }
  }

  public async save(task: Task): Promise<void> {
    const data = {
      タスク名: task.taskName.value,
      ステータス: task.status.value,
      タグ: task.tags.collections.map(tag => tag.tagName.value),
      メモ: task.memo?.value ?? null,
      ユーザー: task.userId.value,
      作業見積: task.estimate?.value.value.value ?? null,
      作業見積単位: task.estimate?.value.unit.value ?? null,
      期日: task.dueDate?.value.toISOString() ?? null,
    };

    const result = await this.store(task, data);
    task.tags.collections.forEach(tag => {
      if (!tag.tagId.isSetId()) {
        const found = result.タグ.find(t => t.value === tag.tagName.value);
        if (found) {
          tag.tagId.setGeneratedId(found.id);
        }
      }
    });
  }

  public async delete(taskId: TaskId): Promise<void> {
    await this.database.delete('tasks', taskId.value);
  }
}
