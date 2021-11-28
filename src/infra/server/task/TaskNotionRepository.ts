import type IDatabase from '$/server/shared/database';
import type ITaskRepository from '$/server/task/taskRepository';
import { singleton, inject } from 'tsyringe';
import Tag from '$/server/tag/tag';
import Tags from '$/server/tag/tags';
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

type RepositoryType = {
  id: string;
  タスク名: string;
  ステータス: string;
  タグ: string[];
  メモ: string | null;
  ユーザー: string;
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
    const response = await this.database.find<RepositoryType>('tasks', taskId.value);
    if (!response) {
      throw new Error('指定されたタスクはありません');
    }

    return Task.reconstruct(
      TaskId.create(response.id),
      TaskName.create(response.タスク名),
      response.メモ ? Memo.create(response.メモ) : null,
      Status.create(response.ステータス),
      DueDate.create(response.期日),
      response.作業見積 && response.作業見積単位 ? Estimate.create({
        value: EstimateValue.create(response.作業見積),
        unit: EstimateUnit.create(response.作業見積単位),
      }) : null,
      UserId.create(response.ユーザー),
      Tags.create(response.タグ.map(tag => Tag.create(TagName.create(tag)))),
    );
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

    if (task.taskId.isSetId()) {
      await this.database.update<RepositoryType>('tasks', {
        id: task.taskId.value,
        ...data,
      });
    } else {
      await this.database.create<RepositoryType>('tasks', data);
    }
  }
}
