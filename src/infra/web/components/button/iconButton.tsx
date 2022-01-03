import type { IIconButtonProps } from 'native-base';
import type { VFC } from 'react';
import { IconButton as NBIconButton } from 'native-base';
import { forwardRef } from 'react';

export type { IIconButtonProps };

const IconButton: VFC<IIconButtonProps> = forwardRef((props, ref) => {
  return props.onPress ? <NBIconButton ref={ref} {...props}/> : null;
});
IconButton.displayName = 'IconButton';

export default IconButton;
