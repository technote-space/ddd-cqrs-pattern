import type { WithControlProps } from '#/form/withControl';
import type { IInputProps } from 'native-base';
import type { ReactElement } from 'react';
import type { FieldValues } from 'react-hook-form';
import { Input } from 'native-base';
import WithControl from '#/form/withControl';

type Props = {
  placeholder?: string;
  variant?: IInputProps['variant'];
};

const TextInput = <T extends FieldValues>({ placeholder, variant, isDisabled, field }: WithControlProps<Props, T>): ReactElement => {
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
