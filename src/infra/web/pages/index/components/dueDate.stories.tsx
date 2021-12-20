import type { ComponentStory, ComponentMeta } from '@storybook/react';
import dayjs from 'dayjs';
import DueDate from './dueDate';

export default {
  title: 'Domain Components/Index/DueDate',
  component: DueDate,
  argTypes: {
    status: { control: { type: 'string' } },
    dueDate: { control: { type: 'string' } },
    estimateValue: { control: { type: 'number' } },
    estimateUnit: { control: { type: 'string' } },
  },
} as ComponentMeta<typeof DueDate>;

const Template: ComponentStory<typeof DueDate> = (args) => <DueDate {...args} />;

export const Default = Template.bind({});
Default.args = {
  status: '登録',
  dueDate: dayjs().subtract(-15, 'day').format('YYYY-MM-DD HH:mm'),
  estimateValue: 10,
  estimateUnit: '日',
};

export const NoDueDate = Template.bind({});
NoDueDate.args = {
  status: '登録',
};

export const Deleted = Template.bind({});
Deleted.args = {
  status: '削除(登録)',
  dueDate: dayjs().subtract(-15, 'day').format('YYYY-MM-DD HH:mm'),
};

export const Finished = Template.bind({});
Finished.args = {
  status: '完了',
  dueDate: dayjs().format('YYYY-MM-DD HH:mm'),
};

export const NoEstimate = Template.bind({});
NoEstimate.args = {
  status: '進行中',
  dueDate: dayjs().subtract(-5, 'day').format('YYYY-MM-DD HH:mm'),
};

export const NotStarted = Template.bind({});
NotStarted.args = {
  status: '登録',
  dueDate: dayjs().subtract(-15, 'day').format('YYYY-MM-DD HH:mm'),
  estimateValue: 10,
  estimateUnit: '日',
};

export const Started = Template.bind({});
Started.args = {
  status: '進行中',
  dueDate: dayjs().subtract(-5, 'day').format('YYYY-MM-DD HH:mm'),
  estimateValue: 10,
  estimateUnit: '日',
};

export const Expired = Template.bind({});
Expired.args = {
  status: '登録',
  dueDate: dayjs().subtract(5, 'hour').format('YYYY-MM-DD HH:mm'),
  estimateValue: 10,
  estimateUnit: '時間',
};
