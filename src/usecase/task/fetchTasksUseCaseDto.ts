import Task from '$/server/task/task';

export type FetchTasksUseCaseDto = {
  id: string;
  タスク名: string;
  メモ: string | null;
  ステータス: string;
  期日: string | null;
  作業見積: number | null;
  作業見積単位: string | null;
  タグ: string[];
};

export const fromEntity = (entity: Task): FetchTasksUseCaseDto => ({
  id: entity.taskId.value,
  タスク名: entity.taskName.value,
  メモ: entity.memo?.value ?? null,
  ステータス: entity.status.value,
  期日: entity.dueDate?.value.toISOString() ?? null,
  作業見積: entity.estimate?.value.value.value ?? null,
  作業見積単位: entity.estimate?.value.unit.value ?? null,
  タグ: entity.tags.collections.map(tag => tag.tagName.value),
});
