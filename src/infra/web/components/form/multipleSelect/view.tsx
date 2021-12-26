import type { HooksParams } from './hooks';
import type { VFC } from 'react';
import { memo, useMemo } from 'react';
import AddTag from './components/addTag';
import TagBadge from './components/tagBadge';
import Flex from '#/layout/flex';

const View: VFC<HooksParams> = ({
  tags,
  isDisabled,
  placeholder,
  addTagValue,
  handleChangeAddTagValue,
  isOpenAddModal,
  handleOpenAddTag,
  handleCloseAddTag,
  handleSubmitAddTag,
  deleteTagHandlers,
}) => {
  return <Flex flexDirection="row" flexWrap="wrap">
    {useMemo(() => tags.map((tag, index) => <TagBadge
      key={index}
      tag={tag}
      isDisabled={isDisabled}
      handleClose={deleteTagHandlers[tag]}
    />), [tags, isDisabled, deleteTagHandlers])}
    <AddTag
      value={addTagValue}
      handleChanged={handleChangeAddTagValue}
      isOpen={isOpenAddModal}
      handleOpen={handleOpenAddTag}
      handleClose={handleCloseAddTag}
      handleSubmit={handleSubmitAddTag}
      placeholder={placeholder}
      isDisabled={isDisabled}
    />
  </Flex>;
};

View.displayName = 'MultipleSelectView';
export default memo(View);
