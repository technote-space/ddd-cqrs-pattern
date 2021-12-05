import type { Dispatch, Reducer } from '$/web/shared/store';
import type { IDarkModeContext, IDarkMode, StoreContext } from '$/web/theme/darkMode';
import { useSelector } from 'react-redux';
import { singleton } from 'tsyringe';

@singleton()
export class DarkModeContext implements IDarkModeContext {
  private readonly TOGGLE_DARK_MODE = 'TOGGLE_DARK_MODE';

  public getKey(): string {
    return 'darkMode';
  }

  public getInitialState(): StoreContext {
    return { darkMode: true };
  }

  public getReducerMapObject(): Record<string, Reducer<StoreContext>> {
    return {
      [this.TOGGLE_DARK_MODE]: (store) => ({
        ...store,
        darkMode: !store?.darkMode,
      }),
    };
  }

  public persistTargets(): Array<keyof StoreContext> {
    return ['darkMode'];
  }

  public useDarkMode(): boolean {
    return useSelector((state: { setting: StoreContext }) => state.setting.darkMode);
  }

  public toggleDarkMode(dispatch: Dispatch) {
    dispatch({ type: this.TOGGLE_DARK_MODE });
  }
}

@singleton()
export class DarkMode implements IDarkMode {
  // eslint-disable-next-line
  public useColorModeValue<T>(lightModeValue: T, darkModeValue: T): T {
    return lightModeValue;
  }

  public toggleDarkMode(): () => void {
    return () => {
      //
    };
  }
}
