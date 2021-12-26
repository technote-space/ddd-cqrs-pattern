import type { ComponentStory, ComponentMeta } from '@storybook/react';
import View from './view';

export default {
  title: 'Common Components/Form/View',
  component: View,
  argTypes: {
    tags: { control: { type: 'object' } },
    isDisabled: { control: { type: 'boolean' } },
    placeholder: { control: { type: 'text' } },
    addTagValue: { control: { type: 'text' } },
    isOpenAddModal: { control: { type: 'boolean' } },
  },
} as ComponentMeta<typeof View>;

const Template: ComponentStory<typeof View> = (args) => <View {...args} deleteTagHandlers={{}}/>;

export const Default = Template.bind({});
Default.args = {
  tags: ['タグ１', 'タグ２'],
  isDisabled: false,
  addTagValue: 'タグ',
  placeholder: '新しく追加するタグを入力',
  isOpenAddModal: true,
};

export const NotOpened = Template.bind({});
NotOpened.args = {
  tags: ['タグ１', 'タグ２'],
  isDisabled: false,
  addTagValue: 'タグ',
  placeholder: '新しく追加するタグを入力',
  isOpenAddModal: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  tags: ['タグ１', 'タグ２'],
  isDisabled: true,
  addTagValue: 'タグ',
  placeholder: '新しく追加するタグを入力',
  isOpenAddModal: true,
};
