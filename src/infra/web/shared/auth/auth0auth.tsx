import type {
  IAuthContext,
  IAuth,
  StoreContext,
  UserResult,
  LogoutCallback,
  IAuthComponent,
  Props,
} from '$/web/shared/auth';
import type { ILoading, ILoadingContext } from '$/web/shared/loading';
import type { Dispatch, Reducer } from '$/web/shared/store';
import type { AppState } from '@auth0/auth0-react';
import { useAuth0 } from '@auth0/auth0-react';
import { Auth0Provider } from '@auth0/auth0-react';
import { createBrowserHistory } from 'history';
import { memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { inject, singleton } from 'tsyringe';
import { client } from '@/web/shared/api';
import { BaseComponent } from '@/web/shared/component';

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

@singleton()
export class Auth0Auth implements IAuth {
  public constructor(
    @inject('IAuthContext') private authContext: IAuthContext,
    @inject('ILoadingContext') private loadingContext: ILoadingContext,
    @inject('ILoading') private loading: ILoading,
  ) {
  }

  public useUser(): UserResult {
    const { isLoading, isAuthenticated, error, getAccessTokenSilently, loginWithRedirect } = useAuth0();

    console.log(isLoading, isAuthenticated, error);

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
}

export type Auth0Config = {
  domain: string;
  clientId: string;
}

@singleton()
export class AuthComponent extends BaseComponent<Props> implements IAuthComponent {
  public constructor(
    @inject('auth0Config') private config: Auth0Config,
  ) {
    super();
  }

  private static getRedirectUri() {
    return `${window.location.origin}${process.env.BASE_PATH}`;
  }

  private static onRedirectCallback(appState: AppState) {
    if (appState?.page) {
      const history = createBrowserHistory();
      history.replace(appState.page);
    }
  }

  protected getComponent() {
    const component = memo(({ children }: Props) => {
      return <Auth0Provider
        redirectUri={AuthComponent.getRedirectUri()}
        onRedirectCallback={AuthComponent.onRedirectCallback}
        {...this.config}
      >
        {children}
      </Auth0Provider>;
    });
    component.displayName = 'LoadingComponent';

    return component;
  }
}
