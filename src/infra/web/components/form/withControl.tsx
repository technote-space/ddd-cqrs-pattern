/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ValidationErrors } from '$/shared/exceptions/domain/validation';
import type { IFormControlProps } from 'native-base';
import type { ReactElement, ReactNode } from 'react';
import type { FieldPath } from 'react-hook-form';
import type { FieldValues, Control, UseControllerReturn } from 'react-hook-form';
import { FormControl, Text } from 'native-base';
import { Controller, useFormState } from 'react-hook-form';
import Badge from '#/data/badge';

export type Props<P extends ComponentProps, T> = T extends FieldValues ? (P & IFormControlProps & {
  name: FieldPath<T>;
  control: Control<T>;
  validationErrors?: ValidationErrors;
  label?: string;
  beforeLabel?: ReactNode;
  afterLabel?: ReactNode;
  isRequired?: boolean;
  isDisabled?: boolean;
}) : never;

const defaultProps = { px: 2, m: 0, mt: 4 };

type ComponentProps = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/ban-types
export type WithControlProps<P extends ComponentProps = {}, T extends FieldValues = FieldValues> = {
  isInvalid?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  label?: string;
} & UseControllerReturn<T> & P;

const WithControl = <P extends ComponentProps, T extends FieldValues>(
  Component: (props: WithControlProps<P, T>) => ReactElement,
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
  }: Props<P, T>): ReactElement => {
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
      } as never as WithControlProps<P, T>);

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
