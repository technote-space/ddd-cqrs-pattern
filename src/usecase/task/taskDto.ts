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

export type TaskDto = {
  id: string;
  taskName: string;
  memo: string | null;
  status: string;
  dueDate: string | null;
  estimateValue: number | null;
  estimateUnit: string | null;
  tags?: string[];
};

export const fromEntity = (entity: Task): TaskDto => ({
  id: entity.taskId.value,
  taskName: entity.taskName.value,
  memo: entity.memo?.value ?? null,
  status: entity.status.value,
  dueDate: entity.dueDate?.value.toISOString() ?? null,
  estimateValue: entity.estimate?.value.value.value ?? null,
  estimateUnit: entity.estimate?.value.unit.value ?? null,
  tags: entity.tags.collections.map(tag => tag.tagName.value),
});

export const toEntity = (userId: UserId, data: Omit<TaskDto, 'id'>): Task => Task.create(
  TaskName.create(data.taskName),
  data.memo ? Memo.create(data.memo) : null,
  Status.create(data.status),
  data.dueDate ? DueDate.create(data.dueDate) : null,
  data.estimateValue && data.estimateUnit ? Estimate.create({
    value: EstimateValue.create(data.estimateValue),
    unit: EstimateUnit.create(data.estimateUnit),
  }) : null,
  userId,
  Tags.create((data.tags ?? []).map(tag => Tag.create(TagName.create(tag)))),
);

export const reconstructEntity = (data: TaskDto): Task => Task.reconstruct(
  TaskId.create(data.id),
  TaskName.create(data.taskName),
  data.memo ? Memo.create(data.memo) : null,
  Status.create(data.status),
  data.dueDate ? DueDate.create(data.dueDate) : null,
  data.estimateValue && data.estimateUnit ? Estimate.create({
    value: EstimateValue.create(data.estimateValue),
    unit: EstimateUnit.create(data.estimateUnit),
  }) : null,
  UserId.create(null),
  Tags.create((data.tags ?? []).map(tag => Tag.reconstruct(TagId.create(null), TagName.create(tag)))),
);
