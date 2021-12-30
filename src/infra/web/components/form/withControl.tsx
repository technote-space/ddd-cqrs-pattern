/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ValidationErrors } from '$/shared/exceptions/domain/validation';
import type { IFormControlProps } from 'native-base';
import type { ReactElement, ReactNode } from 'react';
import type { FieldPath } from 'react-hook-form';
import type { FieldValues, Control, UseControllerReturn } from 'react-hook-form';
import { FormControl, Text } from 'native-base';
import { Controller, useFormState } from 'react-hook-form';
import Badge from '#/data/badge';

export type WithControlComponentCommonProps<T extends FieldValues> = IFormControlProps & {
  name: FieldPath<T>;
  control: Control<T>;
  validationErrors?: ValidationErrors;
  label?: string;
  beforeLabel?: ReactNode;
  afterLabel?: ReactNode;
  isRequired?: boolean;
  isDisabled?: boolean;
};
export type WithControlComponentProps<P extends ComponentProps, T> = T extends FieldValues ? (P & WithControlComponentCommonProps<T>) : never;

const defaultProps = { px: 2, m: 0, mt: 4 };

type ComponentProps = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/ban-types
export type WithControlProps<P extends ComponentProps = {}> = {
  isInvalid?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  label?: string;
} & UseControllerReturn & P;

// eslint-disable-next-line @typescript-eslint/ban-types
export const extractComponentProps = <P extends ComponentProps = {}>({
  isInvalid,
  isDisabled,
  isRequired,
  label,
  field,
  fieldState,
  formState,
  ...props
}: WithControlProps<P>): P => {
  return props as unknown as P;
};

const WithControl = <P extends ComponentProps, T extends FieldValues>(
  Component: (props: WithControlProps<P>) => ReactElement,
) =>
  // eslint-disable-next-line react/display-name
  ({
    name,
    control,
    validationErrors,
    label,
    beforeLabel,
    afterLabel,
    isInvalid,
    isRequired,
    isDisabled,
    ...props
  }: WithControlComponentProps<P, T>): ReactElement => {
    const { errors } = useFormState({ control, name });

    const error = (() => {
      if (name in errors && errors[name]) {
        const error = errors[name];
        if (error && 'message' in error) return error.message;
      }

      if (!validationErrors) {
        return null;
      }

      const found = Object.keys(validationErrors).find(key => key === name);
      if (found) {
        return validationErrors[found].join(', ');
      }

      return null;
    })();
    const componentProps = (renderProps: UseControllerReturn<FieldValues, any>) =>
      ({
        ...props,
        ...renderProps,
        isRequired,
        isDisabled,
        isInvalid: isInvalid || !!error,
        label,
      } as never as WithControlProps<P>);

    return (
      <FormControl {...defaultProps} {...props} isInvalid={!!error} isDisabled={isDisabled}>
        {label && (
          <FormControl.Label>
            {beforeLabel}
            <Text bold>{label}</Text>
            {(isRequired ?? false) && <Badge ml={1} colorScheme="red">必須</Badge>}
            {afterLabel}
          </FormControl.Label>
        )}
        <Controller
          control={control}
          render={(renderProps) => <Component {...componentProps(renderProps)} />}
          name={name}
        />
        <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
      </FormControl>
    );
  };

export default WithControl;
