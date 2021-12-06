import type { Dispatch, Reducer } from '$/web/shared/store';
import type { IDarkModeContext, IDarkMode, StoreContext } from '$/web/theme/darkMode';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { singleton, inject } from 'tsyringe';

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
    /* istanbul ignore next */
    const selector = (state: { darkMode: StoreContext }) => state.darkMode.darkMode;
    return useSelector(selector);
  }

  public toggleDarkMode(dispatch: Dispatch) {
    dispatch({ type: this.TOGGLE_DARK_MODE });
  }
}

@singleton()
export class DarkMode implements IDarkMode {
  public constructor(
    @inject('IDarkModeContext') private context: IDarkModeContext,
  ) {
  }

  // eslint-disable-next-line
  public useColorModeValue<T>(lightModeValue: T, darkModeValue: T): T {
    const darkMode = this.context.useDarkMode();
    return darkMode ? darkModeValue : lightModeValue;
  }

  public useToggleDarkMode(): () => void {
    const dispatch = useDispatch();
    return useCallback(() => this.context.toggleDarkMode(dispatch), [dispatch]);
  }
}
