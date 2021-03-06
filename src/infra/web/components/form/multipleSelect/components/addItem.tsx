import type { VFC } from 'react';
import { Modal, Button, Input } from 'native-base';
import { memo, useRef } from 'react';
import AddButton from '#/button/addButton';

type Props = {
  title: string;
  value: string;
  handleChanged: (text: string) => void,
  isOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  handleSubmit: () => void;
  placeholder?: string;
  isDisabled: boolean;
}

const AddItem: VFC<Props> = ({
  title,
  value,
  handleChanged,
  isOpen,
  handleOpen,
  handleClose,
  handleSubmit,
  placeholder,
  isDisabled,
}) => {
  const cancelRef = useRef();
  return <>
    {!isOpen && <AddButton size="8" ml={1} onPress={handleOpen} isDisabled={isDisabled}/>}
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Modal.Content>
        <Modal.CloseButton/>
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>
          <Input
            value={value}
            onChangeText={handleChanged}
            isDisabled={isDisabled}
            placeholder={placeholder}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              variant="unstyled"
              colorScheme="coolGray"
              onPress={handleClose}
              ref={cancelRef}
              isDisabled={isDisabled}
            >
              キャンセル
            </Button>
            <Button onPress={handleSubmit} isDisabled={isDisabled}>
              追加
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  </>;
};

AddItem.displayName = 'AddTag';
export default memo(AddItem);
