import type { useDarkMode as useDarkModeType, useToggleDarkMode as useToggleDarkModeType } from '$/web/theme/darkMode';
import { container } from 'tsyringe';

/* istanbul ignore next */
export const useDarkMode: useDarkModeType = () => container.resolve<useDarkModeType>('useDarkMode')();
/* istanbul ignore next */
export const useToggleDarkMode: useToggleDarkModeType = () => container.resolve<useToggleDarkModeType>('useToggleDarkMode')();
