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
  タスク名: string;
  メモ: string | null;
  ステータス: string;
  期日: string | null;
  作業見積値: number | null;
  作業見積単位: string | null;
  タグ?: string[];
};

export const fromEntity = (entity: Task): TaskDto => ({
  id: entity.taskId.value,
  タスク名: entity.taskName.value,
  メモ: entity.memo?.value ?? null,
  ステータス: entity.status.value,
  期日: entity.dueDate?.value.toISOString() ?? null,
  作業見積値: entity.estimate?.value.value.value ?? null,
  作業見積単位: entity.estimate?.value.unit.value ?? null,
  タグ: entity.tags.collections.map(tag => tag.tagName.value),
});

export const toEntity = (userId: UserId, data: Omit<TaskDto, 'id'>): Task => Task.create(
  TaskName.create(data.タスク名),
  data.メモ ? Memo.create(data.メモ) : null,
  Status.create(data.ステータス),
  data.期日 ? DueDate.create(data.期日) : null,
  data.作業見積値 && data.作業見積単位 ? Estimate.create({
    value: EstimateValue.create(data.作業見積値),
    unit: EstimateUnit.create(data.作業見積単位),
  }) : null,
  userId,
  Tags.create((data.タグ ?? []).map(tag => Tag.create(TagName.create(tag)))),
);

export type FormValues = Omit<TaskDto, 'id'>;
export const createSchema: CreateSchema = schemaBuilder => ({
  タスク名: schemaBuilder.string().required().label('タスク名'),
  メモ: schemaBuilder.string().nullable().label('メモ'),
  ステータス: schemaBuilder.string().required().label('ステータス'),
  期日: schemaBuilder.date().nullable().label('期日'),
  作業見積値: schemaBuilder.number().nullable().label('作業見積値'),
  作業見積単位: schemaBuilder.string().nullable().label('作業見積単位'),
  タグ: schemaBuilder.array().label('タグ'),
});
