import type { IIconButtonProps } from 'native-base';
import type { FC } from 'react';
import { IconButton, createIcon } from 'native-base';
import { memo } from 'react';

const AddIcon = createIcon({
  viewBox: '0 0 512 512',
  d: 'M359.244,224.004h-59.988c-6.217,0-11.258-5.043-11.258-11.258v-59.992c0-6.215-5.039-11.254-11.256-11.254 h-41.486c-6.217,0-11.258,5.039-11.258,11.254v59.992c0,6.215-5.039,11.258-11.256,11.258h-59.988 c-6.219,0-11.258,5.039-11.258,11.258v41.484c0,6.215,5.039,11.258,11.258,11.258h59.988c6.217,0,11.256,5.039,11.256,11.258 v59.984c0,6.219,5.041,11.258,11.258,11.258h41.486c6.217,0,11.256-5.039,11.256-11.258v-59.984 c0-6.219,5.041-11.258,11.258-11.258h59.988c6.217,0,11.258-5.043,11.258-11.258v-41.484 C370.502,229.043,365.461,224.004,359.244,224.004z M256,0C114.613,0,0,114.617,0,256c0,141.387,114.613,256,256,256c141.383,0,256-114.613,256-256 C512,114.617,397.383,0,256,0z M256,448c-105.871,0-192-86.129-192-192c0-105.867,86.129-192,192-192c105.867,0,192,86.133,192,192 C448,361.871,361.867,448,256,448z',
});

const AddButton: FC<IIconButtonProps> = ({
  variant,
  borderRadius,
  alignItems,
  justifyContent,
  alignSelf,
  ...props
}) => {
  return <IconButton
    variant={variant ?? 'ghost'}
    borderRadius={borderRadius ?? 'full'}
    alignItems={alignItems ?? 'center'}
    justifyContent={justifyContent ?? 'center'}
    alignSelf={alignSelf ?? 'center'}
    icon={<AddIcon/>}
    {...props}
  />;
};

AddButton.displayName = 'AddButton';
export default memo(AddButton);
