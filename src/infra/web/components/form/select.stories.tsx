import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm } from 'react-hook-form';
import Select from './select';

export default {
  title: 'Form Components/Select',
  component: Select,
  argTypes: {
    name: { control: { type: 'text' } },
    placeholder: { control: { type: 'text' } },
    items: { control: { type: 'object' } },
    variant: { control: { type: 'inline-radio' }, options: ['outline', 'rounded', 'underlined', 'filled', 'unstyled'] },
    label: { control: { type: 'text' } },
    isDisabled: { control: { type: 'boolean' } },
  },
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = (args) => {
  const { control } = useForm({ defaultValues: { select: 'test' } });
  return <Select
    {...args}
    control={control as never}
  />;
};

export const Default = Template.bind({});
Default.args = {
  name: 'select',
  label: 'select',
  variant: 'outline',
  items: ['item1', 'item2', 'item3'],
  isDisabled: false,
};

export const Placeholder = Template.bind({});
Placeholder.args = {
  name: 'select',
  label: 'select',
  placeholder: 'placeholder',
  variant: 'outline',
  items: ['item1', 'item2', 'item3'],
  isDisabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  name: 'select',
  label: 'select',
  variant: 'outline',
  items: ['item1', 'item2', 'item3'],
  isDisabled: true,
};
