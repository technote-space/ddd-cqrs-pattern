import type { ComponentStory, ComponentMeta } from '@storybook/react';
import dayjs from 'dayjs';
import Task from './task';

export default {
  title: 'Domain Components/Index/Task',
  component: Task,
  argTypes: {
    task: { control: { type: 'object' } },
  },
} as ComponentMeta<typeof Task>;

const current = dayjs('2000-01-23');
const Template: ComponentStory<typeof Task> = (args) => <Task current={current} {...args} />;

export const Default = Template.bind({});
Default.args = {
  task: {
    id: 'id',
    taskName: 'タスク名',
    memo: 'メモ',
    status: '実行中',
    dueDate: dayjs(current).subtract(-15, 'day').format('YYYY-MM-DD HH:mm'),
    estimateValue: 10,
    estimateUnit: '日',
    tags: ['テスト1', 'テスト2'],
  },
};

export const LongText = Template.bind({});
LongText.args = {
  task: {
    id: 'id',
    taskName: 'タスクタスクタスクタスクタスクタスクタスクタスクタスクタスクタスク',
    memo: 'メモメモメモメモメモメモメモメモメモ\nメモメモメモメモメモメモメモメモメモメモメモメモメモメモメモメモメモメモメモ',
    status: '実行中',
    dueDate: dayjs(current).subtract(5, 'hour').format('YYYY-MM-DD HH:mm'),
    estimateValue: 10,
    estimateUnit: '時間',
    tags: ['テストテストテストテストテストテストテストテストテストテストテストテストテストテスト', 'テスト1', 'テスト2'],
  },
};

export const Optional = Template.bind({});
Optional.args = {
  task: {
    id: 'id',
    taskName: 'タスク',
    memo: null,
    status: '登録',
    dueDate: null,
    estimateValue: null,
    estimateUnit: null,
    tags: [],
  },
};
