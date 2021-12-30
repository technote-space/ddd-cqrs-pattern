import type { WithControlProps } from '#/form/withControl';
import type { INumberInputProps, INumberInputFieldProps } from 'native-base';
import type { ReactElement } from 'react';
import type { FieldValues } from 'react-hook-form';
import {
  NumberInput as NBNumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from 'native-base';
import WithControl, { extractComponentProps } from '#/form/withControl';

type Props = INumberInputProps & {
  placeholder?: string;
  fieldProps?: INumberInputFieldProps;
};

const NumberInput = <T extends FieldValues>({
  placeholder,
  variant,
  label,
  isDisabled,
  fieldProps,
  ...props
}: WithControlProps<Props, T>): ReactElement => {
  return <NBNumberInput
    isDisabled={isDisabled}
    onChange={props.field.onChange}
    {...extractComponentProps(props)}
  >
    <NumberInputField
      placeholder={placeholder ?? label ? `${label}を入力してください` : undefined}
      variant={variant ?? 'outline'}
      onBlur={props.field.onBlur}
      value={props.field.value ?? ''}
      {...fieldProps}
    />
    <NumberInputStepper>
      <NumberIncrementStepper/>
      <NumberDecrementStepper/>
    </NumberInputStepper>
  </NBNumberInput>;
};

export default WithControl(NumberInput);
