import type { IAuth } from '$/web/shared/auth';
import { useColorMode, useColorModeValue } from '@/web/helpers/nativeBase';

export const useHooks = (auth: IAuth) => {
  const onLogout = auth.useLogout();

  const { toggleColorMode } = useColorMode();
  const isDarkMode = useColorModeValue(false, true);

  return {
    onLogout,
    isDarkMode,
    toggleColorMode,
  };
};
export type HooksParams = ReturnType<typeof useHooks>;
