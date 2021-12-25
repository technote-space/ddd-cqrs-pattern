import type { ValidationErrors } from '$/shared/exceptions/domain/validation';
import type { FormValues, TaskDto } from '^/usecase/task/taskDto';
import type { VFC } from 'react';
import type { Control } from 'react-hook-form';
import { memo, useRef } from 'react';
import Button from '#/button/button';
import Modal from '#/dialog/modal';
import FormLayout from '#/form/layout';
import MultiSelect from '#/form/multipleSelect';
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
};
const TaskFormModal: VFC<Props> = ({
  isOpenTaskFormDialog,
  handleCloseTaskFormDialog,
  selectedTask,
  validationErrors,
  onSubmitForm,
  control,
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
          <TextInput
            name="タスク名"
            control={control}
            validationErrors={validationErrors}
            label="タスク名"
            placeholder="タスク名を入力してください"
            isRequired={true}
          />
          <TextArea
            name="メモ"
            control={control}
            validationErrors={validationErrors}
            label="メモ"
            placeholder="メモを入力してください"
          />
          <TextInput
            name="ステータス"
            control={control}
            validationErrors={validationErrors}
            label="ステータス"
            placeholder="ステータスを入力してください"
            isRequired={true}
          />
          <TextInput
            name="期日"
            control={control}
            validationErrors={validationErrors}
            label="期日"
            placeholder="期日を入力してください"
          />
          <TextInput
            name="作業見積値"
            control={control}
            validationErrors={validationErrors}
            label="作業見積値"
            placeholder="作業見積を入力してください"
          />
          <TextInput
            name="作業見積単位"
            control={control}
            validationErrors={validationErrors}
            label="作業見積単位"
            placeholder="作業見積単位を入力してください"
          />
          <MultiSelect
            name="タグ"
            control={control}
            validationErrors={validationErrors}
            label="タグ"
          />
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
          <Button colorScheme="danger" onPress={onSubmitForm}>
            送信
          </Button>
        </Button.Group>
      </Modal.Footer>
    </Modal.Content>
  </Modal>;
};

TaskFormModal.displayName = 'TaskFormModal';
export default memo(TaskFormModal);
