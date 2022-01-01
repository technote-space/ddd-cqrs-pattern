import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { formFields } from '^/usecase/task/taskDto';
import TaskFormModal from './taskFormModal';

export default {
  title: 'Domain Components/Index/TaskFormModal',
  component: TaskFormModal,
  argTypes: {
    isOpenTaskFormDialog: { control: { type: 'boolean' } },
    isDisabled: { control: { type: 'boolean' } },
    selectedTask: { control: { type: 'object' } },
    validationErrors: { control: { type: 'object' } },
    formFields: { control: { type: 'object' } },
  },
} as ComponentMeta<typeof TaskFormModal>;

const Template: ComponentStory<typeof TaskFormModal> = (args) => {
  const { control } = useForm({ defaultValues: { dueDate: '2000-01-23 10:00' } });
  return <TaskFormModal
    {...args}
    control={control as never}
  />;
};

export const Default = Template.bind({});
Default.args = {
  isOpenTaskFormDialog: true,
  formFields,
  validationErrors: {},
};

export const TaskEditForm = Template.bind({});
TaskEditForm.args = {
  isOpenTaskFormDialog: true,
  formFields,
  validationErrors: {},
  selectedTask: {} as never,
};
