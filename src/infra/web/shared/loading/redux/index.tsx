import type { ILoadingComponent, ILoadingContext, StoreContext } from '$/web/shared/loading';
import type { Reducer } from '$/web/shared/store';
import { memo, useMemo } from 'react';
import { singleton } from 'tsyringe';
import { BaseComponent } from '@/web/shared/component';
import { useProcess } from './hooks';
import View from './view';

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
        process: [
          ...store?.process.filter(process => process.id !== action.id) ?? [],
          { id: action.id, message: action.message },
        ],
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

  private static filterMessage(message?: string): message is string {
    return !!message;
  }

  protected getComponent() {
    const component = memo(() => {
      const process = useProcess();
      const messages = useMemo(() => process.map(process => process.message).filter(LoadingComponent.filterMessage), [process]);

      return <View isLoading={!!process.length} messages={messages}/>;
    });
    component.displayName = 'LoadingComponent';

    return component;
  }
}
