import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm } from 'react-hook-form';
import TextInput from './textInput';

export default {
  title: 'Form Components/TextInput',
  component: TextInput,
  argTypes: {
    name: { control: { type: 'text' } },
    placeholder: { control: { type: 'text' } },
    variant: { control: { type: 'inline-radio' }, options: ['outline', 'rounded', 'underlined', 'filled', 'unstyled'] },
    label: { control: { type: 'text' } },
    isDisabled: { control: { type: 'boolean' } },
  },
} as ComponentMeta<typeof TextInput>;

const Template: ComponentStory<typeof TextInput> = (args) => {
  const { control } = useForm({ defaultValues: { textInput: 'test' } });
  return <TextInput
    {...args}
    control={control as never}
  />;
};

export const Default = Template.bind({});
Default.args = {
  name: 'textInput',
  label: 'textInput',
  variant: 'outline',
  isDisabled: false,
};

export const Placeholder = Template.bind({});
Placeholder.args = {
  name: 'textInput',
  label: 'textInput',
  placeholder: 'placeholder',
  variant: 'outline',
  isDisabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  name: 'textInput',
  label: 'textInput',
  variant: 'outline',
  isDisabled: true,
};
