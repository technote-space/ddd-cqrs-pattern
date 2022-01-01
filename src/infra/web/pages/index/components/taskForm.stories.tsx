import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { getFormFields } from '^/usecase/task/taskDto';
import TaskForm from './taskForm';

export default {
  title: 'Domain Components/Index/TaskForm',
  component: TaskForm,
  argTypes: {
    isDisabled: { control: { type: 'boolean' } },
    validationErrors: { control: { type: 'object' } },
    formFields: { control: { type: 'object' } },
  },
} as ComponentMeta<typeof TaskForm>;

const Template: ComponentStory<typeof TaskForm> = (args) => {
  const { control } = useForm({ defaultValues: { dueDate: '2000-01-23 10:00' } });
  return <TaskForm
    {...args}
    control={control as never}
  />;
};

export const Default = Template.bind({});
Default.args = {
  formFields: getFormFields(),
};

export const TaskFormWithErrors = Template.bind({});
TaskFormWithErrors.args = {
  formFields: getFormFields(),
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
  isDisabled: true,
  formFields: getFormFields(),
  validationErrors: {},
};
