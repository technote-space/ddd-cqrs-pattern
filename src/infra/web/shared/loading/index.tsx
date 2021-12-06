import type { ILoading, ILoadingComponent, ILoadingContext, LoadingProcess, StoreContext } from '$/web/shared/loading';
import type { Dispatch, Reducer } from '$/web/shared/store';
import { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { inject, singleton } from 'tsyringe';
import { BaseComponent } from '@/web/shared/component';
import View from './view';

@singleton()
export class LoadingContext implements ILoadingContext {
  private readonly ADD_LOADING = 'ADD_LOADING';
  private readonly DELETE_LOADING = 'DELETE_LOADING';
  private readonly UPDATE_LOADING = 'UPDATE_LOADING';

  public getKey(): string {
    return 'loading';
  }

  public getInitialState(): StoreContext {
    return { process: [] };
  }

  public getReducerMapObject(): Record<string, Reducer<StoreContext>> {
    return {
      [this.ADD_LOADING]: (store, action) => ({
        ...store,
        process: [...store?.process ?? [], { id: action.id, message: action.message }],
      }),
      [this.DELETE_LOADING]: (store, action) => ({
        ...store,
        process: store?.process.filter(process => process.id !== action.id) ?? [],
      }),
      [this.UPDATE_LOADING]: (store, action) => ({
        ...store,
        process: store?.process.map(process => process.id === action.id ? {
          ...process,
          ...action.value,
        } : process) ?? [],
      }),
    };
  }

  public persistTargets(): Array<keyof StoreContext> {
    return [];
  }

  public useProcess(): Array<LoadingProcess> {
    /* istanbul ignore next */
    const selector = (state: { loading: StoreContext }) => state.loading.process;
    return useSelector(selector);
  }

  public add(dispatch: Dispatch, id: string, message?: string) {
    dispatch({ type: this.ADD_LOADING, id, message });
  }

  public delete(dispatch: Dispatch, id: string) {
    dispatch({ type: this.DELETE_LOADING, id });
  }

  public update(dispatch: Dispatch, id: string, value: { message?: string; progress?: number }) {
    dispatch({ type: this.UPDATE_LOADING, id, value });
  }
}

@singleton()
export class Loading implements ILoading {
  public constructor(
    @inject('ILoadingContext') private loadingContext: ILoadingContext,
  ) {
  }

  private static generateRandomString(): string {
    const string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from(Array(32)).map(() => string[Math.floor(Math.random() * string.length)]).join('');
  }

  public useLoading<T>(): (callback: () => Promise<T>, message?: string, identifier?: string) => Promise<T> {
    const dispatch = useDispatch();

    return useCallback(async (callback, message, identifier) => {
      const id = identifier ?? Loading.generateRandomString();
      try {
        this.loadingContext.add(dispatch, id, message);
        return await callback();
      } finally {
        this.loadingContext.delete(dispatch, id);
      }
    }, [dispatch]);
  }

  public isProcessRunning(identifier: string, process: Array<LoadingProcess>): boolean {
    return !!process.find(process => process.id === identifier);
  }
}

@singleton()
export class LoadingComponent extends BaseComponent implements ILoadingComponent {
  public constructor(
    @inject('ILoadingContext') private loadingContext: ILoadingContext,
  ) {
    super();
  }

  protected getComponent() {
    const component = memo(() => {
      const process = this.loadingContext.useProcess();

      return <View isLoading={!!process.length}/>;
    });
    component.displayName = 'LoadingComponent';

    return component;
  }
}
