import type { WithControlProps } from '#/form/withControl';
import { useCallback, useMemo } from 'react';
import { useAddTag } from '#/form/multipleSelect/hooks/addTag';
import { useDeleteTag } from '#/form/multipleSelect/hooks/deleteTag';

export type Props = {
  placeholder?: string;
};

export const useHooks = (props: WithControlProps<Props>) => {
  const tags: string[] = useMemo(() => props.field.value ?? [], [props.field.value]);
  const handleAddTag = useCallback((tag: string) => {
    if (tag === '' || tags.includes(tag)) {
      return false;
    }

    props.field.onChange([...tags, tag]);
    return true;
  }, [tags, props.field]);
  const handleDeleteTag = useCallback((tag: string) => {
    props.field.onChange(tags.filter(_tag => _tag !== tag));
  }, [tags, props.field]);

  return {
    tags,
    isDisabled: !!props.isDisabled,
    placeholder: props.placeholder ?? props.label ? `${props.label}を入力してください` : undefined,
    ...useAddTag({ handleAddTag }),
    ...useDeleteTag({ tags, handleDeleteTag }),
  };
};

export type HooksParams = ReturnType<typeof useHooks>;
