import type { IButtonProps } from 'native-base';
import type { FC } from 'react';
import Button from './button';

const LogoutButton: FC<IButtonProps> = (props) => {
  return <Button {...props}>ログアウト</Button>;
};

LogoutButton.displayName = 'LogoutButton';
export default LogoutButton;
