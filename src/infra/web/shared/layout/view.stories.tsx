import type { ComponentStory, ComponentMeta } from '@storybook/react';
import View from './view';

export default {
  title: 'Domain Components/LayoutView',
  component: View,
  argTypes: {
    children: { control: { type: 'text' } },
  },
} as ComponentMeta<typeof View>;

const Template: ComponentStory<typeof View> = (args) => <View
  {...args}
  onLogout={() => Promise.resolve()}
  toggleColorMode={() => {
  }}
/>;

export const Default = Template.bind({});
Default.args = {
  children: 'Hello World!',
};
