import type { ComponentStory, ComponentMeta } from '@storybook/react';
import dayjs from 'dayjs';
import StatusBadge from './statusBadge';

export default {
  title: 'Domain Components/Index/StatusBadge',
  component: StatusBadge,
  argTypes: {
    status: { control: { type: 'string' } },
    dueDate: { control: { type: 'string' } },
    estimateValue: { control: { type: 'number' } },
    estimateUnit: { control: { type: 'string' } },
  },
} as ComponentMeta<typeof StatusBadge>;

const current = dayjs('2000-01-23');
const Template: ComponentStory<typeof StatusBadge> = (args) => <StatusBadge current={current} {...args} />;

export const Default = Template.bind({});
Default.args = {
  status: '登録',
  dueDate: dayjs(current).subtract(-15, 'day').format('YYYY-MM-DD HH:mm'),
  estimateValue: 10,
  estimateUnit: '日',
};

export const Finished = Template.bind({});
Finished.args = {
  status: '完了',
  dueDate: dayjs(current).format('YYYY-MM-DD HH:mm'),
};

export const Expired = Template.bind({});
Expired.args = {
  status: '登録',
  dueDate: dayjs(current).subtract(5, 'hour').format('YYYY-MM-DD HH:mm'),
  estimateValue: 10,
  estimateUnit: '時間',
};

export const Deleted = Template.bind({});
Deleted.args = {
  status: '削除(登録)',
  dueDate: dayjs(current).subtract(-15, 'day').format('YYYY-MM-DD HH:mm'),
};

export const InProgress = Template.bind({});
InProgress.args = {
  status: '実行中',
  dueDate: dayjs(current).subtract(-5, 'day').format('YYYY-MM-DD HH:mm'),
};

export const NotStarted = Template.bind({});
NotStarted.args = {
  status: '登録',
  dueDate: dayjs(current).subtract(-5, 'day').format('YYYY-MM-DD HH:mm'),
  estimateValue: 10,
  estimateUnit: '日',
};
