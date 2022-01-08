import type { Task as _TaskModel } from '@/server/shared/database/mysql';
import Tag from '$/shared/tag/tag';
import Tags from '$/shared/tag/tags';
import TagId from '$/shared/tag/valueObject/tagId';
import TagName from '$/shared/tag/valueObject/tagName';
import Task from '$/shared/task/task';
import DueDate from '$/shared/task/valueObject/dueDate';
import Estimate from '$/shared/task/valueObject/estimate';
import EstimateUnit from '$/shared/task/valueObject/estimateUnit';
import EstimateValue from '$/shared/task/valueObject/estimateValue';
import Memo from '$/shared/task/valueObject/memo';
import Status from '$/shared/task/valueObject/status';
import TaskId from '$/shared/task/valueObject/taskId';
import TaskName from '$/shared/task/valueObject/taskName';
import UserId from '$/shared/user/valueObject/userId';

export type TaskModel = _TaskModel & { user: { id: number }, tags: { id: number, tagName: string }[] }

export default class MySqlMapper {
  public static toEntity(data: TaskModel): Task {
    return Task.reconstruct(
      TaskId.create(data.id),
      TaskName.create(data.taskName),
      data.memo ? Memo.create(data.memo) : null,
      Status.create(data.status),
      data.dueDate ? DueDate.create(data.dueDate) : null,
      data.estimateValue && data.estimateUnit ? Estimate.create({
        value: EstimateValue.create(data.estimateValue),
        unit: EstimateUnit.create(data.estimateUnit),
      }) : null,
      UserId.create(data.user.id),
      Tags.create(data.tags.map(tag => Tag.reconstruct(TagId.create(tag.id), TagName.create(tag.tagName)))),
    );
  }
}
