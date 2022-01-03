import type { FC } from 'react';
import { SunIcon, MoonIcon } from 'native-base';
import { memo } from 'react';
import IconButton from './iconButton';

type Props = {
  isDarkMode: boolean;
  toggleColorMode: () => void;
}

const ToggleDarkModeButton: FC<Props> = ({ isDarkMode, toggleColorMode }) => {
  return <IconButton
    alignItems="center"
    justifyContent="center"
    alignSelf="center"
    icon={isDarkMode ? <SunIcon/> : <MoonIcon/>}
    onPress={toggleColorMode}
  />;
};

ToggleDarkModeButton.displayName = 'ToggleDarkModeButton';
export default memo(ToggleDarkModeButton);
