import type IEnv from '$/server/shared/env';
import type { IApi } from '$/web/shared/api';
import type { IAuthContext, IAuth, StoreContext, UserResult, LogoutCallback } from '$/web/shared/auth';
import type { IContextProvider } from '$/web/shared/contextProvider';
import type { Dispatch, Reducer } from '$/web/shared/store';
import type { AppState } from '@auth0/auth0-react';
import { useAuth0 } from '@auth0/auth0-react';
import { Auth0Provider } from '@auth0/auth0-react';
import { createBrowserHistory } from 'history';
import { memo, PropsWithChildren, useCallback, useEffect, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { inject, singleton } from 'tsyringe';
import { useAddProcess, useDeleteProcess, useIsProcessRunning, useLoading } from '@/web/shared/loading';

@singleton()
export class AuthContext implements IAuthContext {
  private readonly SET_USER = 'SET_USER';

  public getKey(): string {
    return 'auth';
  }

  public getInitialState(): StoreContext {
    return { user: { isLoggedIn: false } };
  }

  public getReducerMapObject(): Record<string, Reducer<StoreContext>> {
    return {
      [this.SET_USER]: (store, action) => ({ ...store, user: action.user }),
    };
  }

  public persistTargets(): Array<keyof StoreContext> {
    return ['user'];
  }

  public useUser(): UserResult {
    /* istanbul ignore next */
    const selector = (state: { auth: StoreContext }) => state.auth.user;
    return useSelector(selector);
  }

  public setUser(dispatch: Dispatch, user: UserResult) {
    dispatch({ type: this.SET_USER, user });
  }
}

export type Auth0Config = {
  domain: string;
  clientId: string;
}

@singleton()
export class Auth0Auth implements IAuth {
  private _syncLoading = false;

  public constructor(
    @inject('IAuthContext') private authContext: IAuthContext,
    @inject('IApi') private api: IApi,
  ) {
  }

  public useUser(): UserResult {
    const { isLoading, isAuthenticated, error, getAccessTokenSilently, loginWithRedirect } = useAuth0();
    const user = this.authContext.useUser();
    const dispatch = useDispatch();
    const withLoading = useLoading();
    const addProcess = useAddProcess();
    const deleteProcess = useDeleteProcess();
    const isProcessRunning = useIsProcessRunning();
    const caller = this.api.useCaller();

    useEffect(() => {
      if (isLoading) {
        addProcess('loadingAuth0', '認証確認中...');
      } else {
        deleteProcess('loadingAuth0');
      }
    }, [isLoading, addProcess, deleteProcess]);

    useEffect(() => {
      if (isLoading) {
        return;
      }

      // auth0 にログインしていない かつ ログイン状態の場合はログアウト
      if (!isAuthenticated && user.isLoggedIn) {
        this.authContext.setUser(dispatch, {
          isLoggedIn: false,
        });
      }

      // auth0 にログインしていてログイン状態でない場合はログイン
      if (isAuthenticated && !user.isLoggedIn && !isProcessRunning('login') && !this._syncLoading) {
        this._syncLoading = true;
        (async () => {
          await withLoading(async () => {
            const { authorization } = await caller(async client => client.login.$post({ body: { token: await getAccessTokenSilently() } }), { authorization: '' });
            if (authorization) {
              this.authContext.setUser(dispatch, {
                user: { authorization },
                isLoggedIn: true,
              });
            }
          }, 'ログイン中...', 'login');
          this._syncLoading = false;
        })();
      }

      // auth0 にログインしていない場合はログインページにリダイレクト
      if (!isAuthenticated && !error) {
        loginWithRedirect({
          appState: { page: window.location.pathname },
        }).then();
      }
    }, [
      dispatch, isLoading, error, isAuthenticated, user.isLoggedIn,
      caller, getAccessTokenSilently, loginWithRedirect, withLoading, isProcessRunning,
    ]);

    return user;
  }

  public useLogout(): LogoutCallback {
    const { logout } = useAuth0();
    return useCallback(async () => {
      logout();
    }, [logout]);
  }
}

@singleton()
export class Auth0ContextProvider implements IContextProvider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly __provider: VFC<PropsWithChildren<any>>;

  public constructor(
    @inject('IEnv') private env: IEnv,
    @inject('auth0Config') private config: Auth0Config,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider = memo(({ children }: PropsWithChildren<any>) => {
      return <Auth0Provider
        redirectUri={this.getRedirectUri()}
        onRedirectCallback={Auth0ContextProvider.onRedirectCallback}
        {...this.config}
      >
        {children}
      </Auth0Provider>;
    });
    provider.displayName = 'AuthProvider';
    this.__provider = provider;
  }

  private getRedirectUri() {
    return `${window.location.origin}${this.env.getValue('BASE_PATH', '')}`;
  }

  /* istanbul ignore next */
  private static onRedirectCallback(appState: AppState) {
    if (appState?.page) {
      const history = createBrowserHistory();
      history.replace(appState.page);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getProvider(): VFC<PropsWithChildren<any>> {
    return this.__provider;
  }
}
