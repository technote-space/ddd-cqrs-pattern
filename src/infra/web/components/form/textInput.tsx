import type { WithControlProps } from '#/form/withControl';
import type { IInputProps } from 'native-base';
import type { ReactElement } from 'react';
import { Input } from 'native-base';
import WithControl, { extractComponentProps } from '#/form/withControl';

type Props = IInputProps & {
  placeholder?: string;
};

const TextInput = ({
  placeholder,
  variant,
  label,
  isDisabled,
  ...props
}: WithControlProps<Props>): ReactElement => {
  return <Input
    placeholder={placeholder ?? (label ? `${label}を入力してください` : undefined)}
    variant={variant ?? 'outline'}
    isDisabled={isDisabled}
    onBlur={props.field.onBlur}
    onChangeText={props.field.onChange}
    value={props.field.value ?? ''}
    {...extractComponentProps(props)}
  />;
};

export default WithControl(TextInput);
