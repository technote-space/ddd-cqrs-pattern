import { useCallback, useState } from 'react';

type Props = {
  handleAddTag: (tag: string) => boolean;
};

export const useAddTag = ({ handleAddTag }: Props) => {
  const [addTagValue, setAddTagValue] = useState('');
  const handleChangeAddTagValue = useCallback((text: string) => {
    setAddTagValue(text);
  }, []);

  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const handleOpenAddTag = useCallback(() => {
    setAddTagValue('');
    setIsOpenAddModal(true);
  }, []);
  const handleCloseAddTag = useCallback(() => {
    setIsOpenAddModal(false);
  }, []);
  const handleSubmitAddTag = useCallback(() => {
    if (handleAddTag(addTagValue)) {
      setIsOpenAddModal(false);
    }
  }, [handleAddTag, addTagValue]);

  return {
    addTagValue,
    handleChangeAddTagValue,
    isOpenAddModal,
    handleOpenAddTag,
    handleCloseAddTag,
    handleSubmitAddTag,
  };
};
