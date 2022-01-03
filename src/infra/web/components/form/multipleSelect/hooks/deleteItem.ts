import { useMemo } from 'react';

type Props = {
  items: string[];
  handleDeleteItem: (item: string) => void;
};

export const useDeleteItem = ({ items, handleDeleteItem }: Props) => {
  const deleteItemHandlers: Record<string, () => void> = useMemo(() => Object.assign({}, ...items.map(item => ({
    [item]: () => {
      handleDeleteItem(item);
    },
  }))), [items, handleDeleteItem]);

  return {
    deleteItemHandlers,
  };
};
