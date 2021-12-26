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
    タスク名: 'タスク名',
    メモ: 'メモ',
    ステータス: '実行中',
    期日: dayjs(current).subtract(-15, 'day').format('YYYY-MM-DD HH:mm'),
    作業見積値: 10,
    作業見積単位: '日',
    タグ: ['テスト1', 'テスト2'],
  },
};

export const LongText = Template.bind({});
LongText.args = {
  task: {
    id: 'id',
    タスク名: 'タスクタスクタスクタスクタスクタスクタスクタスクタスクタスクタスク',
    メモ: 'メモメモメモメモメモメモメモメモメモ\nメモメモメモメモメモメモメモメモメモメモメモメモメモメモメモメモメモメモメモ',
    ステータス: '実行中',
    期日: dayjs(current).subtract(5, 'hour').format('YYYY-MM-DD HH:mm'),
    作業見積値: 10,
    作業見積単位: '時間',
    タグ: ['テストテストテストテストテストテストテストテストテストテストテストテストテストテスト', 'テスト1', 'テスト2'],
  },
};

export const Optional = Template.bind({});
Optional.args = {
  task: { id: 'id', タスク名: 'タスク', メモ: null, ステータス: '登録', 期日: null, 作業見積値: null, 作業見積単位: null, タグ: [] },
};
