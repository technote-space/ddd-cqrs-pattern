import type { ComponentStory, ComponentMeta } from '@storybook/react';
import View from './view';

export default {
  title: 'Page Components/Index',
  component: View,
  argTypes: {
    user: { control: { type: 'object' } },
    tasks: { control: { type: 'object' } },
    isValidating: { control: { type: 'boolean' } },
  },
} as ComponentMeta<typeof View>;

const Template: ComponentStory<typeof View> = (args) => <View {...args} />;

export const Default = Template.bind({});
Default.args = {
  user: { isLoggedIn: true, user: { authorization: '' } },
  tasks: [
    { id: '1', タスク名: 'タスク1', メモ: null, ステータス: '登録', 期日: null, 作業見積: null, 作業見積単位: null, タグ: [] },
    {
      id: '2',
      タスク名: 'タスク1',
      メモ: 'メモ2',
      ステータス: '実行中',
      期日: '2022-01-23T10:00:00+09:00',
      作業見積: 10,
      作業見積単位: '日',
      タグ: ['テスト1', 'テスト2'],
    },
  ],
  isValidating: false,
};

export const NotLoggedIn = Template.bind({});
NotLoggedIn.args = {
  user: { isLoggedIn: false },
  tasks: undefined,
  isValidating: true,
};

export const NotLoaded = Template.bind({});
NotLoaded.args = {
  user: { isLoggedIn: true, user: { authorization: '' } },
  tasks: undefined,
  isValidating: true,
};