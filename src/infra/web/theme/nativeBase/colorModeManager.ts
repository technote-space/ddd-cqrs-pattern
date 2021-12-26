import type { IContext } from '$/web/shared/store';
import type { Reducer } from '$/web/shared/store';
import type { ColorMode, StorageManager } from 'native-base';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { singleton } from 'tsyringe';

type StoreContext = {
  colorMode: ColorMode;
};

export type IColorModeManagerContext = IContext<StoreContext>;

@singleton()
export class ColorModeContext implements IColorModeManagerContext {
  public static readonly SET_COLOR_MODE = 'SET_COLOR_MODE';

  public getKey(): string {
    return 'colorMode';
  }

  public getInitialState(): StoreContext {
    return { colorMode: 'dark' };
  }

  public getReducerMapObject(): Record<string, Reducer<StoreContext>> {
    return {
      [ColorModeContext.SET_COLOR_MODE]: (store, action) => ({
        ...store,
        colorMode: action.colorMode,
      }),
    };
  }

  public persistTargets(): Array<keyof StoreContext> {
    return ['colorMode'];
  }
}

export const useStorageManager = (): StorageManager => {
  const dispatch = useDispatch();
  /* istanbul ignore next */
  const selector = (state: { colorMode: StoreContext }): ColorMode => state.colorMode.colorMode ?? 'dark';
  const colorMode = useSelector(selector);

  return useMemo(() => ({
    get: async () => {
      return colorMode;
    },
    set: (colorMode: ColorMode) => {
      dispatch({ type: ColorModeContext.SET_COLOR_MODE, colorMode });
    },
  }), [dispatch, colorMode]);
};
