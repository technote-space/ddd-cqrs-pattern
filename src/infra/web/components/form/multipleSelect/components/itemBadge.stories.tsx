import type { ComponentStory, ComponentMeta } from '@storybook/react';
import ItemBadge from './itemBadge';

export default {
  title: 'Common Components/Form/ItemBadge',
  component: ItemBadge,
  argTypes: {
    item: { control: { type: 'text' } },
    isDisabled: { control: { type: 'boolean' } },
  },
} as ComponentMeta<typeof ItemBadge>;

const Template: ComponentStory<typeof ItemBadge> = (args) => <ItemBadge {...args} />;

export const Default = Template.bind({});
Default.args = {
  item: 'タグ',
  isDisabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  item: 'タグ',
  isDisabled: true,
};
