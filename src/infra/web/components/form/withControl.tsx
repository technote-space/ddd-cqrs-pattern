/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ValidationErrors } from '$/shared/exceptions/domain/validation';
import type { IFormControlProps } from 'native-base';
import type { ReactElement, ReactNode, VFC } from 'react';
import type { FieldPath } from 'react-hook-form';
import type { FieldValues, Control, UseControllerReturn } from 'react-hook-form';
import { FormControl, Text } from 'native-base';
import { Controller, useFormState } from 'react-hook-form';
import Badge from '#/data/badge';

export type Props<T> = T extends FieldValues ? IFormControlProps & {
  name: FieldPath<T>;
  key?: string;
  control: Control<any>;
  validationErrors?: ValidationErrors;
  label?: ReactNode;
  beforeLabel?: ReactNode;
  afterLabel?: ReactNode;
  isRequired?: boolean;
  isDisabled?: boolean;
} : never;

const defaultProps = { px: 2, m: 0, mt: 4 };

type ComponentProps = Record<string, any>;
export type WithControlProps<P extends ComponentProps, T extends FieldValues = any> = {
  isInvalid?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
} & UseControllerReturn<T> & P;

type GetComponentProps<U> = U extends WithControlProps<infer P> ? P : never;
type GetFieldValues<U> = U extends WithControlProps<any, infer T> ? T : never;
const WithControl = <U extends WithControlProps<any>>(
  Component: VFC<U>,
) =>
  // eslint-disable-next-line react/display-name
  ({
    name,
    key,
    control,
    validationErrors,
    label,
    beforeLabel,
    afterLabel,
    isInvalid,
    isRequired,
    isDisabled,
    ...props
  }: Props<GetFieldValues<U>> & GetComponentProps<U>): ReactElement => {
    const { errors } = useFormState({ control, name });

    const error = (() => {
      if (name in errors && errors[name]) {
        const error = errors[name];
        if (error && 'message' in error) return error.message;
      }
      if (validationErrors && (key ?? name) in validationErrors) return validationErrors[key ?? name].errors.join(', ');
      return null;
    })();
    const componentProps = (renderProps: UseControllerReturn<FieldValues, any>) =>
      ({
        ...props,
        ...renderProps,
        isRequired,
        isDisabled,
        isInvalid: isInvalid || !!error,
      } as WithControlProps<any>);

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
