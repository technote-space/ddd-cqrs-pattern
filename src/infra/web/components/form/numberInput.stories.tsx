import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm } from 'react-hook-form';
import NumberInput from './numberInput';

export default {
  title: 'Form Components/NumberInput',
  component: NumberInput,
  argTypes: {
    name: { control: { type: 'text' } },
    variant: { control: { type: 'inline-radio' }, options: ['outline', 'rounded', 'underlined', 'filled', 'unstyled'] },
    label: { control: { type: 'text' } },
    isDisabled: { control: { type: 'boolean' } },
  },
} as ComponentMeta<typeof NumberInput>;

const Template: ComponentStory<typeof NumberInput> = (args) => {
  const { control } = useForm();
  return <NumberInput
    {...args}
    control={control as never}
  />;
};

export const Default = Template.bind({});
Default.args = {
  name: 'numberInput',
  label: 'numberInput',
  variant: 'outline',
  isDisabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  name: 'numberInput',
  label: 'numberInput',
  variant: 'outline',
  isDisabled: true,
};
