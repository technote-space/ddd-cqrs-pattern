import type { ComponentStory, ComponentMeta } from '@storybook/react';
import TagBadge from './tagBadge';

export default {
  title: 'Common Components/Form/TagBadge',
  component: TagBadge,
  argTypes: {
    tag: { control: { type: 'text' } },
    isDisabled: { control: { type: 'boolean' } },
  },
} as ComponentMeta<typeof TagBadge>;

const Template: ComponentStory<typeof TagBadge> = (args) => <TagBadge {...args} />;

export const Default = Template.bind({});
Default.args = {
  tag: 'タグ',
  isDisabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  tag: 'タグ',
  isDisabled: true,
};
