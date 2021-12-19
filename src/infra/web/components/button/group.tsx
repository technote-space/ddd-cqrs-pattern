import type { IButtonGroupProps } from 'native-base/lib/typescript/components/primitives/Button';
import type { VFC } from 'react';
import { Button } from 'native-base';

const ButtonGroup: VFC<IButtonGroupProps> = ({ children, ...props }) => {
  return <Button.Group {...props} >
    {children}
  </Button.Group>;
};

ButtonGroup.displayName = 'ButtonGroup';
export default ButtonGroup;
