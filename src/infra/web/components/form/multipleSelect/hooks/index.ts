import type { WithControlProps } from '#/form/withControl';
import { useCallback, useMemo } from 'react';
import { useAddItem } from '#/form/multipleSelect/hooks/addItem';
import { useDeleteItem } from '#/form/multipleSelect/hooks/deleteItem';

export type Props = {
  placeholder?: string;
};

export const useHooks = (props: WithControlProps<Props>) => {
  const items: string[] = useMemo(() => props.field.value ?? [], [props.field.value]);
  const handleAddItem = useCallback((item: string) => {
    if (item === '' || items.includes(item)) {
      return false;
    }

    props.field.onChange([...items, item]);
    return true;
  }, [items, props.field]);
  const handleDeleteItem = useCallback((item: string) => {
    props.field.onChange(items.filter(_item => _item !== item));
  }, [items, props.field]);

  return {
    items,
    isDisabled: !!props.isDisabled,
    placeholder: props.placeholder ?? props.label ? `${props.label}を入力してください` : undefined,
    ...useAddItem({ handleAddItem, isDisabled: props.isDisabled }),
    ...useDeleteItem({ items, handleDeleteItem }),
  };
};

export type HooksParams = ReturnType<typeof useHooks>;
