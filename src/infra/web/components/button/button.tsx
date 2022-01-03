import type { IButtonProps } from 'native-base';
import type { VFC, MutableRefObject } from 'react';
import { Button as NBButton } from 'native-base';
import { forwardRef } from 'react';

export type { IButtonProps };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Button: VFC<IButtonProps> = forwardRef<any, IButtonProps>((props, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return props.onPress ? <NBButton ref={ref as MutableRefObject<any>} {...props} /> : null;
});
Button.displayName = 'Button';

export default {
  ...Button,
  Group: NBButton.Group,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as VFC<IButtonProps & { ref?: MutableRefObject<any> }> & { Group: typeof NBButton.Group };
