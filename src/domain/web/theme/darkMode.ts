import type { IContext } from '$/web/shared/store';

export type StoreContext = {
  darkMode: boolean;
};

export type IDarkModeContext = IContext<StoreContext>

export type useDarkMode = () => boolean;
export type useToggleDarkMode = () => () => void;
