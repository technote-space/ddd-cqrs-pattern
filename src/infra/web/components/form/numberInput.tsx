import type { WithControlProps } from '#/form/withControl';
import type { INumberInputProps, INumberInputFieldProps } from 'native-base';
import type { ReactElement } from 'react';
import {
  NumberInput as NBNumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from 'native-base';
import WithControl, { extractComponentProps } from '#/form/withControl';

type Props = INumberInputProps & {
  fieldProps?: INumberInputFieldProps;
};

const NumberInput = ({
  variant,
  label,
  isDisabled,
  fieldProps,
  ...props
}: WithControlProps<Props>): ReactElement => {
  return <NBNumberInput
    isDisabled={isDisabled}
    onChange={props.field.onChange}
    defaultValue={props.field.value ?? '0'}
    {...extractComponentProps(props)}
  >
    <NumberInputField
      variant={variant ?? 'outline'}
      onBlur={props.field.onBlur}
      value={props.field.value ?? '0'}
      {...fieldProps}
    />
    <NumberInputStepper>
      <NumberIncrementStepper/>
      <NumberDecrementStepper/>
    </NumberInputStepper>
  </NBNumberInput>;
};

export default WithControl(NumberInput);
