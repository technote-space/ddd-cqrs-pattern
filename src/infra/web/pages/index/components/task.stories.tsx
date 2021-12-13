import type { ComponentStory, ComponentMeta } from '@storybook/react';
import Task from './task';

export default {
  title: 'Domain Components/Task',
  component: Task,
  argTypes: {
    task: { control: { type: 'object' } },
  },
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const Default = Template.bind({});
Default.args = {
  task: {
    id: 'id',
    タスク名: 'タスク名',
    メモ: 'メモ',
    ステータス: '実行中',
    期日: '2022-01-23T10:00:00+09:00',
    作業見積: 10,
    作業見積単位: '日',
    タグ: ['テスト1', 'テスト2'],
  },
};

export const Optional = Template.bind({});
Optional.args = {
  task: { id: 'id', タスク名: 'タスク', メモ: null, ステータス: '登録', 期日: null, 作業見積: null, 作業見積単位: null, タグ: [] },
};
