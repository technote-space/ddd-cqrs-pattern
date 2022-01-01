import type { ComponentStory, ComponentMeta } from '@storybook/react';
import type { FormFields } from '^/usecase/task/taskDto';
import { useForm } from 'react-hook-form';
import TagName from '$/server/tag/valueObject/tagName';
import DueDate from '$/server/task/valueObject/dueDate';
import EstimateUnit from '$/server/task/valueObject/estimateUnit';
import EstimateValue from '$/server/task/valueObject/estimateValue';
import Memo from '$/server/task/valueObject/memo';
import Status from '$/server/task/valueObject/status';
import TaskName from '$/server/task/valueObject/taskName';
import View from './view';

export default {
  title: 'Page Components/Index',
  component: View,
  argTypes: {
    user: { control: { type: 'object' } },
    tasks: { control: { type: 'object' } },
    isValidatingTasks: { control: { type: 'boolean' } },
    isOpenTaskFormDialog: { control: { type: 'boolean' } },
    isDisabled: { control: { type: 'boolean' } },
    isOpenDeleteTaskDialog: { control: { type: 'boolean' } },
    formFields: { control: { type: 'object' } },
    validationErrors: { control: { type: 'object' } },
    selectedTask: { control: { type: 'object' } },
    deleteTargetTask: { control: { type: 'object' } },
  },
} as ComponentMeta<typeof View>;

const Template: ComponentStory<typeof View> = (args) => {
  const { control } = useForm();
  return <View
    {...args}
    updateTaskHandlers={{}}
    deleteTaskHandlers={{}}
    control={control as never}
  />;
};

const formFields: FormFields = {
  taskName: { label: TaskName.getLabel(), component: 'textInput', isRequired: true, props: {} },
  memo: { label: Memo.getLabel(), component: 'textArea', isRequired: false, props: {} },
  status: {
    label: Status.getLabel(),
    component: 'select',
    isRequired: true,
    props: { items: Status.create('').flagTypes },
  },
  dueDate: { label: DueDate.getLabel(), component: 'dateTimePicker', isRequired: false, props: {} },
  estimateValue: { label: EstimateValue.getLabel(), component: 'numberInput', isRequired: false, props: { min: 0 } },
  estimateUnit: {
    label: EstimateUnit.getLabel(),
    component: 'select',
    isRequired: false,
    props: { items: EstimateUnit.create('').flagTypes },
  },
  tags: { label: TagName.getLabel(), component: 'multipleSelect', isRequired: false, props: {} },
};

export const Default = Template.bind({});
Default.args = {
  user: { isLoggedIn: true, user: { authorization: '' } },
  tasks: [
    {
      id: '1',
      taskName: 'タスク1',
      memo: null,
      status: '登録',
      dueDate: null,
      estimateValue: null,
      estimateUnit: null,
      tags: [],
    },
    {
      id: '2',
      taskName: 'タスク2',
      memo: 'メモ2',
      status: '完了',
      dueDate: '2000-01-23 10:00',
      estimateValue: 10,
      estimateUnit: '日',
      tags: ['テスト1', 'テスト2'],
    },
  ],
  isValidatingTasks: false,
  formFields: {} as never,
};

export const NotLoggedIn = Template.bind({});
NotLoggedIn.args = {
  user: { isLoggedIn: false },
  tasks: undefined,
  isValidatingTasks: true,
  formFields: {} as never,
};

export const NotLoaded = Template.bind({});
NotLoaded.args = {
  user: { isLoggedIn: true, user: { authorization: '' } },
  tasks: undefined,
  isValidatingTasks: true,
  formFields: {} as never,
};

export const TaskForm = Template.bind({});
TaskForm.args = {
  user: { isLoggedIn: true, user: { authorization: '' } },
  tasks: undefined,
  isValidatingTasks: false,
  isOpenTaskFormDialog: true,
  formFields,
  validationErrors: {},
};

export const TaskFormWithErrors = Template.bind({});
TaskFormWithErrors.args = {
  user: { isLoggedIn: true, user: { authorization: '' } },
  tasks: undefined,
  isValidatingTasks: false,
  isOpenTaskFormDialog: true,
  formFields,
  validationErrors: {
    taskName: ['error1', 'error2'],
    memo: ['error1', 'error2'],
    status: ['error1', 'error2'],
    dueDate: ['error1', 'error2'],
    estimateValue: ['error1', 'error2'],
    estimateUnit: ['error1', 'error2'],
    tags: ['error1', 'error2'],
  },
};

export const DisabledTaskForm = Template.bind({});
DisabledTaskForm.args = {
  user: { isLoggedIn: true, user: { authorization: '' } },
  tasks: undefined,
  isValidatingTasks: false,
  isOpenTaskFormDialog: true,
  isDisabled: true,
  formFields,
  validationErrors: {},
};

export const TaskEditForm = Template.bind({});
TaskEditForm.args = {
  user: { isLoggedIn: true, user: { authorization: '' } },
  tasks: undefined,
  isValidatingTasks: false,
  isOpenTaskFormDialog: true,
  formFields,
  validationErrors: {},
  selectedTask: {} as never,
};

export const DeleteDialog = Template.bind({});
DeleteDialog.args = {
  user: { isLoggedIn: true, user: { authorization: '' } },
  tasks: undefined,
  isValidatingTasks: false,
  isOpenDeleteTaskDialog: true,
  formFields,
  validationErrors: {},
  deleteTargetTask: { taskName: 'test' } as never,
};
