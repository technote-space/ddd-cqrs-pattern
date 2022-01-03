import type { IIconButtonProps } from 'native-base';
import type { FC } from 'react';
import { createIcon } from 'native-base';
import { memo } from 'react';
import IconButton from './iconButton';

const RestoreIcon = createIcon({
  viewBox: '0 0 512 512',
  d: 'M292.497,168.968c-21.134,0-40.287,0-57.542,0V65.394L0,255.995l234.955,190.61V334.395 c7.132,0,14.331,0,21.578,0c95.305,0,227.772-2.396,237.359,100.701C541.847,322.408,501.086,168.968,292.497,168.968z',
});

const RestoreButton: FC<IIconButtonProps> = ({
  colorScheme,
  variant,
  borderRadius,
  alignItems,
  justifyContent,
  alignSelf,
  ...props
}) => {
  return <IconButton
    variant={variant ?? 'solid'}
    borderRadius={borderRadius ?? 'full'}
    alignItems={alignItems ?? 'center'}
    justifyContent={justifyContent ?? 'center'}
    alignSelf={alignSelf ?? 'center'}
    icon={<RestoreIcon/>}
    colorScheme={colorScheme ?? 'red'}
    {...props}
  />;
};

RestoreButton.displayName = 'RestoreButton';
export default memo(RestoreButton);
