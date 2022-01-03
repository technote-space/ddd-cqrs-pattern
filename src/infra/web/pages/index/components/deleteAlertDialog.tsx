import type Task from '$/shared/task/task';
import type { VFC } from 'react';
import { memo, useRef } from 'react';
import Button from '#/button/button';
import AlertDialog from '#/dialog/alertDialog';
import Heading from '#/text/heading';
import Text from '#/text/text';

type Props = {
  isOpenDeleteTaskDialog: boolean;
  handleCloseDeleteTaskDialog: () => void;
  deleteTargetTask?: Task;
  onDelete: () => void;
};
const DeleteAlertDialog: VFC<Props> = ({
  isOpenDeleteTaskDialog,
  handleCloseDeleteTaskDialog,
  deleteTargetTask,
  onDelete,
}) => {
  const cancelRef = useRef();
  return <AlertDialog
    leastDestructiveRef={cancelRef}
    isOpen={isOpenDeleteTaskDialog}
    onClose={handleCloseDeleteTaskDialog}
  >
    <AlertDialog.Content>
      <AlertDialog.CloseButton/>
      <AlertDialog.Header>タスク削除</AlertDialog.Header>
      <AlertDialog.Body>
        <Heading>{deleteTargetTask?.taskName.value}</Heading>
        <Text>{deleteTargetTask?.status?.isDeleted() ? 'このタスクを完全に削除してもよろしいですか？' : 'このタスクを削除してもよろしいですか？'}</Text>
      </AlertDialog.Body>
      <AlertDialog.Footer>
        <Button.Group space={2}>
          <Button
            variant="unstyled"
            colorScheme="coolGray"
            onPress={handleCloseDeleteTaskDialog}
            ref={cancelRef}
          >
            キャンセル
          </Button>
          <Button colorScheme="danger" onPress={onDelete}>
            削除
          </Button>
        </Button.Group>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog>;
};

DeleteAlertDialog.displayName = 'DeleteAlertDialog';
export default memo(DeleteAlertDialog);
