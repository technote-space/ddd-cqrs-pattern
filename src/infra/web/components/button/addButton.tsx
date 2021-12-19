import type { IIconButtonProps } from 'native-base';
import type { FC } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { IconButton } from 'native-base';

const AddButton: FC<IIconButtonProps> = (props) => {
  return <IconButton variant="solid" _icon={{ as: AntDesign, name: 'addfile' }} {...props}/>;
};

AddButton.displayName = 'AddButton';
export default AddButton;
