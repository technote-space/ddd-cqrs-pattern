import type Task from '$/server/task/task';
import type { VFC } from 'react';
import { memo, useRef } from 'react';
import Button from '#/button/button';
import AlertDialog from '#/dialog/alertDialog';
import Heading from '#/text/heading';
import Text from '#/text/text';

type Props = {
  isOpenRestoreTaskDialog: boolean;
  handleCloseRestoreTaskDialog: () => void;
  restoreTargetTask?: Task;
  onRestore: () => void;
};
const RestoreAlertDialog: VFC<Props> = ({
  isOpenRestoreTaskDialog,
  handleCloseRestoreTaskDialog,
  restoreTargetTask,
  onRestore,
}) => {
  const cancelRef = useRef();
  return <AlertDialog
    leastDestructiveRef={cancelRef}
    isOpen={isOpenRestoreTaskDialog}
    onClose={handleCloseRestoreTaskDialog}
  >
    <AlertDialog.Content>
      <AlertDialog.CloseButton/>
      <AlertDialog.Header>タスク復元</AlertDialog.Header>
      <AlertDialog.Body>
        <Heading>{restoreTargetTask?.taskName.value}</Heading>
        <Text>このタスクを復元しますか？</Text>
      </AlertDialog.Body>
      <AlertDialog.Footer>
        <Button.Group space={2}>
          <Button
            variant="unstyled"
            colorScheme="coolGray"
            onPress={handleCloseRestoreTaskDialog}
            ref={cancelRef}
          >
            キャンセル
          </Button>
          <Button colorScheme="primary" onPress={onRestore}>
            復元
          </Button>
        </Button.Group>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog>;
};

RestoreAlertDialog.displayName = 'RestoreAlertDialog';
export default memo(RestoreAlertDialog);
