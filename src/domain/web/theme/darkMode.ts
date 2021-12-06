import type { IContext, Dispatch } from '$/web/shared/store';

export type StoreContext = {
  darkMode: boolean;
};

export interface IDarkModeContext extends IContext<StoreContext> {
  useDarkMode(): boolean;

  toggleDarkMode(dispatch: Dispatch): void;
}

export interface IDarkMode {
  useColorModeValue<T>(lightModeValue: T, darkModeValue: T): T;

  useToggleDarkMode(): () => void;
}
