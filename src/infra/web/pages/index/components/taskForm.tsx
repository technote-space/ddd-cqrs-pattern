import type { ValidationErrors } from '$/shared/exceptions/domain/validation';
import type { FormValues } from '^/usecase/task/taskDto';
import type { FormFields } from '^/usecase/task/taskDto';
import type { VFC } from 'react';
import type { Control } from 'react-hook-form';
import { memo } from 'react';
import DateTimePicker from '#/form/dateTimePicker';
import FormLayout from '#/form/layout';
import MultiSelect from '#/form/multipleSelect';
import NumberInput from '#/form/numberInput';
import Select from '#/form/select';
import TextArea from '#/form/textArea';
import TextInput from '#/form/textInput';

type Props = {
  formFields: FormFields;
  control: Control<FormValues>;
  isDisabled: boolean;
  validationErrors: ValidationErrors;
};

const FormComponents = {
  textInput: TextInput,
  textArea: TextArea,
  multipleSelect: MultiSelect,
  numberInput: NumberInput,
  dateTimePicker: DateTimePicker,
  select: Select,
} as const;
export type FormComponentsType = typeof FormComponents;
export type FormComponentKey = keyof FormComponentsType;

const TaskForm: VFC<Props> = ({
  validationErrors,
  control,
  isDisabled,
  formFields,
}) => {
  return <FormLayout>
    {Object.entries(formFields).map(([name, { label, isRequired, component, props }], index) => {
      const Component = FormComponents[component];
      return <Component
        key={index}
        name={name as keyof FormValues}
        control={control}
        validationErrors={validationErrors}
        label={label}
        isRequired={isRequired}
        isDisabled={isDisabled}
        {...props as any /* eslint-disable-line @typescript-eslint/no-explicit-any */}
      />;
    })}
  </FormLayout>;
};

TaskForm.displayName = 'TaskForm';
export default memo(TaskForm);
