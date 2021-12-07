import type { IAuthContext, IAuth, StoreContext, UserResult, LogoutCallback } from '$/web/shared/auth';
import type { ILoading, ILoadingContext } from '$/web/shared/loading';
import type { Dispatch, Reducer } from '$/web/shared/store';
import type { AppState } from '@auth0/auth0-react';
import { useAuth0 } from '@auth0/auth0-react';
import { Auth0Provider } from '@auth0/auth0-react';
import { createBrowserHistory } from 'history';
import { memo, PropsWithChildren, useCallback, useEffect, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { inject, singleton } from 'tsyringe';
import { client } from '@/web/shared/api';

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
    return [];
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly __provider: VFC<PropsWithChildren<any>>;

  public constructor(
    @inject('IAuthContext') private authContext: IAuthContext,
    @inject('ILoadingContext') private loadingContext: ILoadingContext,
    @inject('ILoading') private loading: ILoading,
    @inject('auth0Config') private config: Auth0Config,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider = memo(({ children }: PropsWithChildren<any>) => {
      return <Auth0Provider
        redirectUri={Auth0Auth.getRedirectUri()}
        onRedirectCallback={Auth0Auth.onRedirectCallback}
        {...this.config}
      >
        {children}
      </Auth0Provider>;
    });
    provider.displayName = 'AuthProvider';
    this.__provider = provider;
  }

  public useUser(): UserResult {
    const { isLoading, isAuthenticated, error, getAccessTokenSilently, loginWithRedirect } = useAuth0();
    const user = this.authContext.useUser();
    const process = this.loadingContext.useProcess();
    const dispatch = useDispatch();
    const withLoading = this.loading.useLoading();

    useEffect(() => {
      if (isLoading) {
        this.loadingContext.add(dispatch, 'loadingAuth0');
      } else {
        this.loadingContext.delete(dispatch, 'loadingAuth0');
      }
    }, [dispatch, isLoading]);

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
      if (isAuthenticated && !user.isLoggedIn && !this.loading.isProcessRunning('login', process)) {
        (async () => {
          await withLoading(async () => {
            const { authorization } = await client.login.$post({ body: { token: await getAccessTokenSilently() } });
            this.authContext.setUser(dispatch, {
              user: { authorization },
              isLoggedIn: true,
            });
          }, 'ログイン中...', 'login');
        })();
      }

      // auth0 にログインしていない場合はログインページにリダイレクト
      if (!isAuthenticated && !error) {
        loginWithRedirect({
          appState: { page: window.location.pathname },
        }).then();
      }
    }, [
      dispatch, isLoading, error, isAuthenticated, user.isLoggedIn, process,
      getAccessTokenSilently, loginWithRedirect, withLoading,
    ]);

    return user;
  }

  public useLogout(): LogoutCallback {
    const { logout } = useAuth0();
    return useCallback(async () => {
      logout();
    }, [logout]);
  }

  private static getRedirectUri() {
    return `${window.location.origin}${process.env.BASE_PATH}`;
  }

  /* istanbul ignore next */
  private static onRedirectCallback(appState: AppState) {
    if (appState?.page) {
      const history = createBrowserHistory();
      history.replace(appState.page);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getAuthProvider(): VFC<PropsWithChildren<any>> {
    return this.__provider;
  }
}
