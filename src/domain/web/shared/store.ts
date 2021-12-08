/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Action<T = any> {
  type: T;
}

export interface AnyAction extends Action {
  [extraProps: string]: any;
}

export type Reducer<S = any, A extends Action = AnyAction> = (state: S | undefined, action: A) => S;

export interface Dispatch<A extends Action = AnyAction> {
  <T extends A>(action: T): T;
}

export interface IContext<StoreContext extends Record<string, any>> {
  getKey(): string;

  getInitialState(): StoreContext;

  getReducerMapObject(): Record<string, Reducer<StoreContext>>;

  persistTargets(): Array<keyof StoreContext>;
}
