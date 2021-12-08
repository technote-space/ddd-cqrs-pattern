import type { IContext, Dispatch } from './store';

export type LogoutCallback = () => Promise<void>;
export type User = {
  authorization: string;
};

export type UserResult = {
  user: User;
  isLoggedIn: true;
} | {
  isLoggedIn: false;
}

export type StoreContext = {
  user: UserResult;
}

export interface IAuthContext extends IContext<StoreContext> {
  useUser(): UserResult;

  setUser(dispatch: Dispatch, user: UserResult): void;
}

export interface IAuth {
  useUser(): UserResult;

  useLogout(): LogoutCallback;
}
