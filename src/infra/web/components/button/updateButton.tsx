import type { IIconButtonProps } from 'native-base';
import type { FC } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { IconButton } from 'native-base';

const AddButton: FC<IIconButtonProps> = (props) => {
  return <IconButton variant="solid" borderRadius="full" _icon={{ as: AntDesign, name: 'edit' }} {...props}/>;
};

AddButton.displayName = 'AddButton';
export default AddButton;
