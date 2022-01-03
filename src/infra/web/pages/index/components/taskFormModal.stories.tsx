import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { getFormFields } from '@/web/helpers/form';
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
    handleCloseTaskFormDialog={() => {
    }}
    onSubmitForm={() => {
    }}
  />;
};

export const Default = Template.bind({});
Default.args = {
  isOpenTaskFormDialog: true,
  formFields: getFormFields(),
  validationErrors: {},
};

export const TaskEditForm = Template.bind({});
TaskEditForm.args = {
  isOpenTaskFormDialog: true,
  formFields: getFormFields(),
  validationErrors: {},
  selectedTask: {} as never,
};
