import type { ILoadingComponent, ILoadingContext, StoreContext } from '$/web/shared/loading';
import type { Reducer } from '$/web/shared/store';
import { memo } from 'react';
import { singleton } from 'tsyringe';
import { BaseComponent } from '@/web/shared/component';
import View from '@/web/shared/loading/view';
import { useProcess } from './hooks';

@singleton()
export class LoadingContext implements ILoadingContext {
  public static readonly ADD_LOADING = 'ADD_LOADING';
  public static readonly DELETE_LOADING = 'DELETE_LOADING';

  public getKey(): string {
    return 'loading';
  }

  public getInitialState(): StoreContext {
    return { process: [] };
  }

  public getReducerMapObject(): Record<string, Reducer<StoreContext>> {
    return {
      [LoadingContext.ADD_LOADING]: (store, action) => ({
        ...store,
        process: [...store?.process ?? [], { id: action.id, message: action.message }],
      }),
      [LoadingContext.DELETE_LOADING]: (store, action) => ({
        ...store,
        process: store?.process.filter(process => process.id !== action.id) ?? [],
      }),
    };
  }

  public persistTargets(): Array<keyof StoreContext> {
    return [];
  }
}

@singleton()
export class LoadingComponent extends BaseComponent implements ILoadingComponent {
  public constructor() {
    super();
  }

  protected getComponent() {
    const component = memo(() => {
      const process = useProcess();

      return <View isLoading={!!process.length}/>;
    });
    component.displayName = 'LoadingComponent';

    return component;
  }
}
