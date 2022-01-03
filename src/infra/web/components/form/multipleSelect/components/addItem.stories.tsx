import type { ComponentStory, ComponentMeta } from '@storybook/react';
import AddItem from './addItem';

export default {
  title: 'Common Components/Form/AddItem',
  component: AddItem,
  argTypes: {
    value: { control: { type: 'text' } },
    isOpen: { control: { type: 'boolean' } },
    isDisabled: { control: { type: 'boolean' } },
  },
} as ComponentMeta<typeof AddItem>;

const Template: ComponentStory<typeof AddItem> = (args) => <AddItem
  {...args}
  handleOpen={() => {}}
  handleClose={() => {}}
  handleSubmit={() => {}}
/>;

export const Default = Template.bind({});
Default.args = {
  value: 'タグ',
  isOpen: true,
  isDisabled: false,
};

export const NotOpened = Template.bind({});
NotOpened.args = {
  value: 'タグ',
  isOpen: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  value: 'タグ',
  isOpen: true,
  isDisabled: true,
};
