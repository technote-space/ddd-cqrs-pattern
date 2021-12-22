import type { ValidationErrors } from '$/shared/exceptions/domain/validation';
import type { PromiseGenerator } from '$/web/shared/api';
import type { IApi } from '$/web/shared/api';
import type { ObjectShape } from 'yup/lib/object';
import { useCallback, useMemo, useState } from 'react';
import * as yup from 'yup';
import * as ja from 'yup-locale-ja';
import Api from '@/web/shared/api';

yup.setLocale(ja.descriptive);

export type CreateSchema = (schemaBuilder: typeof yup) => ObjectShape;
export const useFormSchema = (generator: CreateSchema) => {
  return useMemo(() => yup.object().shape(generator(yup)), [generator]);
};
export type AfterSubmit = () => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HandleError = (error: any) => void;

export const useOnSubmit = <FormValues, DataType>(
  getCallerParams: (params: FormValues) => [PromiseGenerator<DataType>, string | undefined],
  api: IApi,
  afterSubmit?: AfterSubmit,
  handleError?: HandleError,
) => {
  const caller = api.useCaller();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const onSubmit = useCallback(async (params: FormValues) => {
    setValidationErrors({});
    try {
      await caller(...getCallerParams(params));
    } catch (e) {
      if (Api.isAxiosError(e) && e.response?.status === 422) {
        const validationError = e.response.data as { context: ValidationErrors };
        setValidationErrors(validationError.context);

        return;
      }

      if (handleError) {
        handleError(e);
      }
      return;
    }

    if (afterSubmit) {
      afterSubmit();
    }
  }, [caller, getCallerParams, setValidationErrors, afterSubmit, handleError]);

  return { validationErrors, onSubmit };
};
