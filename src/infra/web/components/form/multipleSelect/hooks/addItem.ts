import { useCallback, useState } from 'react';

type Props = {
  handleAddItem: (item: string) => boolean;
  isDisabled?: boolean;
};

export const useAddItem = ({ handleAddItem, isDisabled }: Props) => {
  const [addItemValue, setAddItemValue] = useState('');
  const handleChangeAddItemValue = useCallback((text: string) => {
    setAddItemValue(text);
  }, []);

  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const handleOpenAddItem = useCallback(() => {
    setAddItemValue('');
    setIsOpenAddModal(true);
  }, []);
  const handleCloseAddItem = useCallback(() => {
    setIsOpenAddModal(false);
  }, []);
  const handleSubmitAddItem = useCallback(() => {
    if (handleAddItem(addItemValue)) {
      setIsOpenAddModal(false);
    }
  }, [handleAddItem, addItemValue]);

  return {
    addItemValue,
    handleChangeAddItemValue,
    isOpenAddModal: isOpenAddModal && !isDisabled,
    handleOpenAddItem,
    handleCloseAddItem,
    handleSubmitAddItem,
  };
};
