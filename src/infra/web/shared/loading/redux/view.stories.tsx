import type { ComponentStory, ComponentMeta } from '@storybook/react';
import View from './view';

export default {
  title: 'Domain Components/LoadingView',
  component: View,
  argTypes: {
    isLoading: { control: { type: 'boolean' } },
  },
} as ComponentMeta<typeof View>;

const Template: ComponentStory<typeof View> = (args) => <View {...args} />;

export const Default = Template.bind({});
Default.args = {
  isLoading: true,
};

export const NotLoading = Template.bind({});
NotLoading.args = {
  isLoading: false,
};
