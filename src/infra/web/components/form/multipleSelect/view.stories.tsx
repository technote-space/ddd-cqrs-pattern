import type { ComponentStory, ComponentMeta } from '@storybook/react';
import View from './view';

export default {
  title: 'Common Components/Form/View',
  component: View,
  argTypes: {
    items: { control: { type: 'object' } },
    isDisabled: { control: { type: 'boolean' } },
    placeholder: { control: { type: 'text' } },
    addItemValue: { control: { type: 'text' } },
    isOpenAddModal: { control: { type: 'boolean' } },
  },
} as ComponentMeta<typeof View>;

const Template: ComponentStory<typeof View> = (args) => <View
  {...args}
  deleteItemHandlers={{}}
  handleChangeAddItemValue={() => {
  }}
  handleOpenAddItem={() => {
  }}
  handleCloseAddItem={() => {
  }}
  handleSubmitAddItem={() => {
  }}
/>;

export const Default = Template.bind({});
Default.args = {
  items: ['タグ１', 'タグ２'],
  isDisabled: false,
  addItemValue: 'タグ',
  placeholder: '新しく追加するタグを入力',
  isOpenAddModal: true,
};

export const NotOpened = Template.bind({});
NotOpened.args = {
  items: ['タグ１', 'タグ２'],
  isDisabled: false,
  addItemValue: 'タグ',
  placeholder: '新しく追加するタグを入力',
  isOpenAddModal: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  items: ['タグ１', 'タグ２'],
  isDisabled: true,
  addItemValue: 'タグ',
  placeholder: '新しく追加するタグを入力',
  isOpenAddModal: true,
};
