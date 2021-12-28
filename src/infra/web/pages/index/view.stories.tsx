import type { ComponentStory, ComponentMeta } from '@storybook/react';
import dayjs from 'dayjs';
import View from './view';

export default {
  title: 'Page Components/Index',
  component: View,
  argTypes: {
    user: { control: { type: 'object' } },
    tasks: { control: { type: 'object' } },
    isValidatingTasks: { control: { type: 'boolean' } },
  },
} as ComponentMeta<typeof View>;

const Template: ComponentStory<typeof View> = (args) => <View
  {...args}
  formFields={{} as never}
  updateTaskHandlers={{}}
  deleteTaskHandlers={{}}
/>;

export const Default = Template.bind({});
export const NotLoggedIn = Template.bind({});

Default.args = {
  user: { isLoggedIn: true, user: { authorization: '' } },
  tasks: [
    {
      id: '1',
      taskName: 'タスク1',
      memo: null,
      status: '登録',
      dueDate: null,
      estimateValue: null,
      estimateUnit: null,
      tags: [],
    },
    {
      id: '2',
      taskName: 'タスク2',
      memo: 'メモ2',
      status: '実行中',
      dueDate: dayjs().subtract(-15, 'day').format('YYYY-MM-DD HH:mm'),
      estimateValue: 10,
      estimateUnit: '日',
      tags: ['テスト1', 'テスト2'],
    },
  ],
  isValidatingTasks: false,
};
NotLoggedIn.args = {
  user: { isLoggedIn: false },
  tasks: undefined,
  isValidatingTasks: true,
};

export const NotLoaded = Template.bind({});
NotLoaded.args = {
  user: { isLoggedIn: true, user: { authorization: '' } },
  tasks: undefined,
  isValidatingTasks: true,
};
