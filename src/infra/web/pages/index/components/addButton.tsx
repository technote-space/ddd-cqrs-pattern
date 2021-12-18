import type { IButtonProps } from 'native-base';
import type { FC } from 'react';
import { Button } from 'native-base';

const AddButton: FC<IButtonProps> = (props) => {
  return <Button {...props}>追加</Button>;
};

AddButton.displayName = 'AddButton';
export default AddButton;
