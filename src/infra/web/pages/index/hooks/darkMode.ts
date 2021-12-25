import { useColorMode, useColorModeValue } from '@/web/helpers/nativeBase';

export const useDarkMode = () => {
  const { toggleColorMode } = useColorMode();
  const isDarkMode = useColorModeValue(false, true);

  return {
    isDarkMode,
    toggleColorMode,
  };
};
