import { useMemo } from 'react';

type Props = {
  tags: string[];
  handleDeleteTag: (tag: string) => void;
};

export const useDeleteTag = ({ tags, handleDeleteTag }: Props) => {
  const deleteTagHandlers: Record<string, () => void> = useMemo(() => Object.assign({}, ...tags.map(tag => ({
    [tag]: () => {
      handleDeleteTag(tag);
    },
  }))), [tags, handleDeleteTag]);

  return {
    deleteTagHandlers,
  };
};
