import type { IComponent } from '$/web/shared/component';
import type { Dispatch, IContext } from '$/web/shared/store';

export type LoadingProcess = {
  id: string;
  message?: string;
  progress?: number;
};
export type StoreContext = {
  process: Array<LoadingProcess>;
};

export interface ILoadingContext extends IContext<StoreContext> {
  useProcess(): Array<LoadingProcess>;

  add(dispatch: Dispatch, id: string, message?: string): void;

  delete(dispatch: Dispatch, id: string): void;

  update(dispatch: Dispatch, id: string, value: { message?: string; progress?: number; }): void;
}

export interface ILoading {
  useLoading<T>(): (callback: () => Promise<T>, message?: string, identifier?: string) => Promise<T>;

  isProcessRunning(identifier: string, process: Array<LoadingProcess>): boolean;
}

export type ILoadingComponent = IComponent
