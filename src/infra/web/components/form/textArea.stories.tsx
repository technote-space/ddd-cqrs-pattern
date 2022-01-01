import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm } from 'react-hook-form';
import TextArea from './textArea';

export default {
  title: 'Form Components/TextArea',
  component: TextArea,
  argTypes: {
    name: { control: { type: 'text' } },
    placeholder: { control: { type: 'text' } },
    variant: { control: { type: 'inline-radio' }, options: ['outline', 'rounded', 'underlined', 'filled', 'unstyled'] },
    label: { control: { type: 'text' } },
    isDisabled: { control: { type: 'boolean' } },
  },
} as ComponentMeta<typeof TextArea>;

const Template: ComponentStory<typeof TextArea> = (args) => {
  const { control } = useForm({ defaultValues: { textArea: 'test' } });
  return <TextArea
    {...args}
    control={control as never}
  />;
};

export const Default = Template.bind({});
Default.args = {
  name: 'textArea',
  label: 'textArea',
  variant: 'outline',
  isDisabled: false,
};

export const Placeholder = Template.bind({});
Placeholder.args = {
  name: 'textArea',
  label: 'textArea',
  placeholder: 'placeholder',
  variant: 'outline',
  isDisabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  name: 'textArea',
  label: 'textArea',
  variant: 'outline',
  isDisabled: true,
};
