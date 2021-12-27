import type { CreateSchema } from '@/web/helpers/form';
import type { FormComponentType } from '@/web/pages/index/components/taskFormModal';
import { useMemo } from 'react';
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

export type FormValues = Omit<TaskDto, 'id'>;
export const createSchema: CreateSchema = schemaBuilder => ({
  taskName: schemaBuilder.string().required().label(TaskName.getLabel()),
  memo: schemaBuilder.string().nullable().label(Memo.getLabel()),
  status: schemaBuilder.string().required().label(Status.getLabel()),
  dueDate: schemaBuilder.date().nullable().label(DueDate.getLabel()),
  estimateValue: schemaBuilder.number().nullable().label(EstimateValue.getLabel()),
  estimateUnit: schemaBuilder.string().nullable().label(EstimateUnit.getLabel()),
  tags: schemaBuilder.array().label(TagName.getLabel()),
});

export type FormFields = {
  [key in keyof FormValues]: {
    label: string;
    isRequired?: boolean;
    component: FormComponentType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props?: Record<string, any>;
  }
};
export const useFormFields = (): { formFields: FormFields } => {
  return useMemo(() => ({
    formFields: {
      taskName: {
        label: TaskName.getLabel(),
        isRequired: true,
        component: 'textInput',
      },
      memo: {
        label: Memo.getLabel(),
        component: 'textArea',
      },
      status: {
        label: Status.getLabel(),
        isRequired: true,
        component: 'select',
        props: { items: Status.create('').flagTypes },
      },
      dueDate: {
        label: DueDate.getLabel(),
        component: 'datePicker',
      },
      estimateValue: {
        label: EstimateValue.getLabel(),
        component: 'numberInput',
      },
      estimateUnit: {
        label: EstimateUnit.getLabel(),
        component: 'select',
        props: { items: EstimateUnit.create('').flagTypes },
      },
      tags: {
        label: TagName.getLabel(),
        component: 'multipleSelect',
      },
    },
  }), []);
};
