import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm } from 'react-hook-form';
import  { getFormFields } from '^/usecase/task/taskDto';
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
  const { control } = useForm({ defaultValues: { dueDate: '2000-01-23 10:00' } });
  return <View
    {...args}
    updateTaskHandlers={{}}
    deleteTaskHandlers={{}}
    control={control as never}
  />;
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
  formFields: getFormFields(),
  validationErrors: {},
};

export const DeleteDialog = Template.bind({});
DeleteDialog.args = {
  user: { isLoggedIn: true, user: { authorization: '' } },
  tasks: undefined,
  isValidatingTasks: false,
  isOpenDeleteTaskDialog: true,
  formFields: getFormFields(),
  validationErrors: {},
  deleteTargetTask: { taskName: 'test' } as never,
};
