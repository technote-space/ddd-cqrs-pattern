import type { Reducer } from '$/web/shared/store';
import type { IDarkModeContext, StoreContext } from '$/web/theme/darkMode';
import { singleton } from 'tsyringe';

@singleton()
export class DarkModeContext implements IDarkModeContext {
  public static readonly TOGGLE_DARK_MODE = 'TOGGLE_DARK_MODE';

  public getKey(): string {
    return 'darkMode';
  }

  public getInitialState(): StoreContext {
    return { darkMode: true };
  }

  public getReducerMapObject(): Record<string, Reducer<StoreContext>> {
    return {
      [DarkModeContext.TOGGLE_DARK_MODE]: (store) => ({
        ...store,
        darkMode: !store?.darkMode,
      }),
    };
  }

  public persistTargets(): Array<keyof StoreContext> {
    return ['darkMode'];
  }
}
