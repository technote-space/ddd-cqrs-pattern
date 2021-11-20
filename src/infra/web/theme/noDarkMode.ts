import type { IDarkMode } from '$/web/theme/darkMode';

export class NoDarkMode implements IDarkMode {
  // eslint-disable-next-line
  public useColorModeValue<T>(lightModeValue: T, darkModeValue: T): T {
    return lightModeValue;
  }

  public toggleColorMode(): () => void {
    return () => {
      //
    };
  }
}
