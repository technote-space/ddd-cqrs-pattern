import type { ValidationErrors } from '$/shared/exceptions/domain/validation';
import type { FormValues, TaskDto } from '^/usecase/task/taskDto';
import type { FormFields } from '^/usecase/task/taskDto';
import type { VFC } from 'react';
import type { Control } from 'react-hook-form';
import { memo, useMemo, useRef } from 'react';
import Button from '#/button/button';
import Modal from '#/dialog/modal';
import DateTimePicker from '#/form/dateTimePicker';
import FormLayout from '#/form/layout';
import MultiSelect from '#/form/multipleSelect';
import NumberInput from '#/form/numberInput';
import Select from '#/form/select';
import TextArea from '#/form/textArea';
import TextInput from '#/form/textInput';

type Props = {
  isOpenTaskFormDialog: boolean;
  handleCloseTaskFormDialog: () => void;
  selectedTask?: TaskDto,
  validationErrors: ValidationErrors;
  onSubmitForm: () => void;
  control: Control<FormValues>;
  isDisabled: boolean;
  formFields: FormFields;
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

const TaskFormModal: VFC<Props> = ({
  isOpenTaskFormDialog,
  handleCloseTaskFormDialog,
  selectedTask,
  validationErrors,
  onSubmitForm,
  control,
  isDisabled,
  formFields,
}) => {
  const cancelRef = useRef();
  return <Modal
    isOpen={isOpenTaskFormDialog}
    onClose={handleCloseTaskFormDialog}
  >
    <Modal.Content>
      <Modal.CloseButton/>
      <Modal.Header>{selectedTask ? 'タスク編集' : 'タスク追加'}</Modal.Header>
      <Modal.Body>
        <FormLayout>
          {useMemo(() => Object.entries(formFields).map(([name, { label, isRequired, component, props }], index) => {
            const Component = FormComponents[component];
            return <Component
              key={index}
              name={name as keyof FormValues}
              control={control}
              validationErrors={validationErrors}
              label={label}
              isRequired={isRequired}
              {...props as any /* eslint-disable-line @typescript-eslint/no-explicit-any */}
            />;
          }), [formFields, control, validationErrors])}
        </FormLayout>
      </Modal.Body>
      <Modal.Footer>
        <Button.Group space={2}>
          <Button
            variant="unstyled"
            colorScheme="coolGray"
            onPress={handleCloseTaskFormDialog}
            ref={cancelRef}
          >
            キャンセル
          </Button>
          <Button colorScheme="danger" onPress={onSubmitForm} isDisabled={isDisabled}>
            送信
          </Button>
        </Button.Group>
      </Modal.Footer>
    </Modal.Content>
  </Modal>;
};

TaskFormModal.displayName = 'TaskFormModal';
export default memo(TaskFormModal);
