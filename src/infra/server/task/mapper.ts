import type { Relation } from '$/server/shared/database';
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

export type DatabaseType = {
  id: string;
  taskName: string;
  memo: string | null;
  status: string;
  tags: Relation[];
  user: Relation;
  estimateValue: number | null;
  estimateUnit: string | null;
  dueDate: string | null;
};

export default class Mapper {
  public static toEntity(data: DatabaseType): Task {
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
      Tags.create(data.tags.map(tag => Tag.reconstruct(TagId.create(tag.id), TagName.create(tag.value)))),
    );
  }
}
