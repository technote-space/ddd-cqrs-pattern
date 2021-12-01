import type IDatabase from '$/server/shared/database';
import type { CreateData, Relation } from '$/server/shared/database';
import type ITaskRepository from '$/server/task/taskRepository';
import { inject, singleton } from 'tsyringe';
import Tag from '$/server/tag/tag';
import Tags from '$/server/tag/tags';
import TagId from '$/server/tag/valueObject/tagId';
import TagName from '$/server/tag/valueObject/tagName';
import Task from '$/server/task/task';
import DueDate from '$/server/task/valueObject/dueDate';
import Estimate from '$/server/task/valueObject/estimate';
import EstimateUnit from '$/server/task/valueObject/estimateUnit';
import EstimateValue from '$/server/task/valueObject/estimateValue';
import Memo from '$/server/task/valueObject/memo';
import Status from '$/server/task/valueObject/status';
import TaskId from '$/server/task/valueObject/taskId';
import TaskName from '$/server/task/valueObject/taskName';
import UserId from '$/server/user/valueObject/userId';

type DatabaseType = {
  id: string;
  タスク名: string;
  ステータス: string;
  タグ: Relation[];
  メモ: string | null;
  ユーザー: Relation;
  作業見積: number | null;
  作業見積単位: string | null;
  期日: string | null;
};

@singleton()
export default class TaskNotionRepository implements ITaskRepository {
  public constructor(
    @inject('IDatabase') private database: IDatabase,
  ) {
  }

  public async findById(taskId: TaskId): Promise<Task> {
    const response = await this.database.find<DatabaseType>('tasks', taskId.value);
    if (!response) {
      throw new Error('指定されたタスクはありません');
    }

    return Task.reconstruct(
      TaskId.create(response.id),
      TaskName.create(response.タスク名),
      response.メモ ? Memo.create(response.メモ) : null,
      Status.create(response.ステータス),
      response.期日 ? DueDate.create(response.期日) : null,
      response.作業見積 && response.作業見積単位 ? Estimate.create({
        value: EstimateValue.create(response.作業見積),
        unit: EstimateUnit.create(response.作業見積単位),
      }) : null,
      UserId.create(response.ユーザー.id),
      Tags.create(response.タグ.map(tag => Tag.reconstruct(TagId.create(tag.id), TagName.create(tag.value)))),
    );
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
