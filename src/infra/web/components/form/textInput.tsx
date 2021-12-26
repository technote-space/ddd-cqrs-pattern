import type { WithControlProps } from '#/form/withControl';
import type { IInputProps } from 'native-base';
import type { VFC } from 'react';
import { Input } from 'native-base';
import WithControl from '#/form/withControl';

type Props = {
  placeholder?: string;
  variant?: IInputProps['variant'];
};

const TextInput: VFC<WithControlProps<Props>> = ({ placeholder, variant, isDisabled, field }) => {
  return <Input
    placeholder={placeholder}
    variant={variant ?? 'outline'}
    isDisabled={isDisabled}
    onBlur={field.onBlur}
    onChangeText={field.onChange}
    value={field.value ?? ''}
  />;
};

export default WithControl(TextInput);
