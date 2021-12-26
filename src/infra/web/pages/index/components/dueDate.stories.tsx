import type { ComponentStory, ComponentMeta } from '@storybook/react';
import dayjs from 'dayjs';
import DueDate from './dueDate';

export default {
  title: 'Domain Components/Index/DueDate',
  component: DueDate,
  argTypes: {
    status: { control: { type: 'inline-radio' }, options: ['登録', '実行中', '完了', '削除(登録)', '削除(実行中)', '削除(完了)'] },
    dueDate: { control: { type: 'date' } },
    estimateValue: { control: { type: 'number' } },
    estimateUnit: { control: { type: 'inline-radio' }, options: ['日', '時間'] },
  },
} as ComponentMeta<typeof DueDate>;

const current = dayjs('2000-01-23');
const Template: ComponentStory<typeof DueDate> = (args) => <DueDate current={current} {...args} />;

export const Default = Template.bind({});
Default.args = {
  status: '登録',
  dueDate: dayjs(current).subtract(-15, 'day').format('YYYY-MM-DD HH:mm'),
  estimateValue: 10,
  estimateUnit: '日',
};

export const NoDueDate = Template.bind({});
NoDueDate.args = {
  status: '登録',
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
  estimateValue: 10,
  estimateUnit: '日',
};

export const NotStarted = Template.bind({});
NotStarted.args = {
  status: '登録',
  dueDate: dayjs(current).subtract(-15, 'day').format('YYYY-MM-DD HH:mm'),
  estimateValue: 10,
  estimateUnit: '日',
};

export const NoEstimate = Template.bind({});
NoEstimate.args = {
  status: '実行中',
  dueDate: dayjs(current).subtract(-5, 'day').format('YYYY-MM-DD HH:mm'),
};
