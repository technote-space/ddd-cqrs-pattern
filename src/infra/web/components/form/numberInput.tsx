import type { WithControlProps } from '#/form/withControl';
import type { INumberInputFieldProps } from 'native-base';
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

type Props = INumberInputFieldProps & {
  placeholder?: string;
};

const NumberInput = <T extends FieldValues>({
  placeholder,
  variant,
  label,
  isDisabled,
  ...props
}: WithControlProps<Props, T>): ReactElement => {
  return <NBNumberInput
    isDisabled={isDisabled}
    onChange={props.field.onChange}
  >
    <NumberInputField
      placeholder={placeholder ?? label ? `${label}を入力してください` : undefined}
      variant={variant ?? 'outline'}
      onBlur={props.field.onBlur}
      value={props.field.value ?? ''}
      {...extractComponentProps(props)}
    />
    <NumberInputStepper>
      <NumberIncrementStepper/>
      <NumberDecrementStepper/>
    </NumberInputStepper>
  </NBNumberInput>;
};

export default WithControl(NumberInput);
