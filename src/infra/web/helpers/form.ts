import type { WithControlComponentCommonProps } from '#/form/withControl';
import type { ValidationErrors } from '$/shared/exceptions/domain/validation';
import type { PromiseGenerator } from '$/web/shared/api';
import type { IApi } from '$/web/shared/api';
import type { FormComponentsType, FormComponentKey } from '@/web/pages/index/components/taskFormModal';
import type { FormValues } from '^/usecase/task/taskDto';
import type { ObjectShape } from 'yup/lib/object';
import { useCallback, useMemo, useState } from 'react';
import * as yup from 'yup';
import * as ja from 'yup-locale-ja';
import TagName from '$/server/tag/valueObject/tagName';
import DueDate from '$/server/task/valueObject/dueDate';
import EstimateUnit from '$/server/task/valueObject/estimateUnit';
import EstimateValue from '$/server/task/valueObject/estimateValue';
import Memo from '$/server/task/valueObject/memo';
import Status from '$/server/task/valueObject/status';
import TaskName from '$/server/task/valueObject/taskName';
import Api from '@/web/shared/api';

yup.setLocale(ja.descriptive);

export type CreateSchema = (schemaBuilder: typeof yup) => ObjectShape;
export const useFormSchema = (generator: CreateSchema) => {
  return useMemo(() => yup.object().shape(generator(yup)), [generator]);
};
export type AfterSubmit = () => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HandleError = (error: any) => void;

export const useOnSubmit = <FormValues, DataType, F extends DataType | undefined>(
  getCallerParams: (params: FormValues) => [PromiseGenerator<DataType, F>, F, string | undefined],
  api: IApi,
  afterSubmit?: AfterSubmit,
  handleError?: HandleError,
) => {
  const caller = api.useCaller();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const resetValidationErrors = useCallback(() => {
    setValidationErrors({});
  }, [setValidationErrors]);
  const onSubmit = useCallback(async (params: FormValues) => {
    setValidationErrors({});
    try {
      await caller(...getCallerParams(params), true);
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

  return { validationErrors, resetValidationErrors, onSubmit };
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PropsType<C extends FormComponentKey> = Omit<Parameters<FormComponentsType[C]>[0], keyof WithControlComponentCommonProps<any>>;
type FormFieldProps<C extends FormComponentKey> = {
  label: string;
  isRequired?: boolean;
  component: C;
  props: PropsType<C>;
};
const getFormField = <C extends FormComponentKey>(label: string, component: C, isRequired: boolean, props: PropsType<C>): FormFieldProps<C> => ({
  label,
  component,
  isRequired,
  props,
});
export type FormFields = {
  [key in keyof FormValues]: FormFieldProps<FormComponentKey>;
};
export const getFormFields = (): FormFields => {
  return {
    taskName: getFormField(TaskName.getLabel(), 'textInput', true, {}),
    memo: getFormField(Memo.getLabel(), 'textArea', false, {}),
    status: getFormField(Status.getLabel(), 'select', true, { items: Status.getActiveStatuses() }),
    dueDate: getFormField(DueDate.getLabel(), 'dateTimePicker', false, {}),
    estimateValue: getFormField(EstimateValue.getLabel(), 'numberInput', false, { min: 0 }),
    estimateUnit: getFormField(EstimateUnit.getLabel(), 'select', false, { items: EstimateUnit.create('').flagTypes }),
    tags: getFormField(TagName.getLabel(), 'multipleSelect', false, {}),
  };
};
