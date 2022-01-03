import type { HooksParams } from './hooks';
import type { VFC } from 'react';
import { memo, useMemo } from 'react';
import Flex from '#/layout/flex';
import AddItem from './components/addItem';
import ItemBadge from './components/itemBadge';

const View: VFC<HooksParams> = ({
  items,
  isDisabled,
  placeholder,
  addItemValue,
  handleChangeAddItemValue,
  isOpenAddModal,
  handleOpenAddItem,
  handleCloseAddItem,
  handleSubmitAddItem,
  deleteItemHandlers,
}) => {
  return <Flex flexDirection="row" flexWrap="wrap">
    {useMemo(() => items.map((item, index) => <ItemBadge
      key={index}
      item={item}
      isDisabled={isDisabled}
      handleDelete={deleteItemHandlers[item]}
    />), [items, isDisabled, deleteItemHandlers])}
    <AddItem
      value={addItemValue}
      handleChanged={handleChangeAddItemValue}
      isOpen={isOpenAddModal}
      handleOpen={handleOpenAddItem}
      handleClose={handleCloseAddItem}
      handleSubmit={handleSubmitAddItem}
      placeholder={placeholder}
      isDisabled={isDisabled}
    />
  </Flex>;
};

View.displayName = 'MultipleSelectView';
export default memo(View);
