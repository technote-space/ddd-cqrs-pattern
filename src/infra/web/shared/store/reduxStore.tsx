/* eslint-disable @typescript-eslint/no-explicit-any */
import type IEnv from '$/server/shared/env';
import type { AnyAction, IContext, IStore, Reducer } from '$/web/shared/store';
import type { PropsWithChildren, VFC } from 'react';
import { memo } from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';
import { container, inject, singleton } from 'tsyringe';

@singleton()
export class ReduxStore<StoreContext extends Record<string, any>> implements IStore {
  private readonly __provider: VFC<PropsWithChildren<any>>;

  public constructor(
    @inject('IEnv') env: IEnv,
    @inject('contexts') contexts: string[],
  ) {
    const middlewares = [];
    /* istanbul ignore next */
    if (env.getValue('NODE_ENV', '') === 'development') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { logger } = require(`redux-logger`);
      middlewares.push(logger);
    }

    const _contexts = contexts.map(context => container.resolve<IContext<any>>(context));
    const store = createStore(this.getReducer(_contexts), this.getInitialState(_contexts), applyMiddleware(...middlewares));
    const persistor = persistStore(store);
    const provider = memo(({ children }: PropsWithChildren<any>) => {
      return <Provider store={store}>
        <PersistGate persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>;
    });
    provider.displayName = 'StoreProvider';
    this.__provider = provider;
  }

  protected getInitialState(contexts: IContext<any>[]) {
    return Object.assign({}, ...contexts.map(context => ({ [context.getKey()]: context.getInitialState() })));
  }

  protected getReducer(contexts: IContext<any>[]): Reducer {
    return combineReducers(Object.assign({}, ...contexts.map(context => {
      const mapObject = context.getReducerMapObject();
      const reducer = (state: StoreContext | undefined, action: AnyAction) => {
        if (action.type in mapObject) {
          return mapObject[action.type](state, action);
        }

        return state ?? null;
      };

      const targets = context.persistTargets() as Array<string>;
      if (targets.length) {
        return {
          [context.getKey()]: persistReducer({
            key: context.getKey(),
            storage,
            whitelist: targets,
          }, reducer),
        };
      }

      return { [context.getKey()]: reducer };
    }))) as Reducer;
  }

  public getStoreProvider(): VFC<PropsWithChildren<any>> {
    return this.__provider;
  }
}
