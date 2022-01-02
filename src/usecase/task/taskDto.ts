import type { CreateSchema } from '@/web/helpers/form';
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
import TaskName from '$/server/task/valueObject/taskName';
import UserId from '$/server/user/valueObject/userId';

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
  status: entity.status.displayValue,
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

export type FormValues = Omit<TaskDto, 'id'>;
const transformNullable = <T>(value: T, originalValue: string): T | null => {
  return originalValue === '' ? null : value;
};
export const createSchema: CreateSchema = schemaBuilder => ({
  taskName: schemaBuilder.string().required().label(TaskName.getLabel()),
  memo: schemaBuilder.string().nullable().label(Memo.getLabel()).transform(transformNullable),
  status: schemaBuilder.string().required().label(Status.getLabel()),
  dueDate: schemaBuilder.date().nullable().label(DueDate.getLabel()).transform(transformNullable),
  estimateValue: schemaBuilder.number().nullable().label(EstimateValue.getLabel()).transform(transformNullable),
  estimateUnit: schemaBuilder.string().nullable().label(EstimateUnit.getLabel()).transform(transformNullable),
  tags: schemaBuilder.array().label(TagName.getLabel()),
});
