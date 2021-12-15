import type { useColor as useColorType, ThemeColor } from '$/web/theme/color';
import { container } from 'tsyringe';
import { useDarkMode } from '@/web/theme/drakMode';

export const useColor: useColorType = (key: keyof ThemeColor) => {
  const themeColor = container.resolve<ThemeColor>('ThemeColor');
  const darkMode = useDarkMode();

  return darkMode ? themeColor[key].dark : themeColor[key].light;
};
