import type { IComponent } from '$/web/shared/component';
import type { IContext, Dispatch } from './store';
import type { PropsWithChildren } from 'react';

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

export type Props = PropsWithChildren<any>;
export type IAuthComponent = IComponent<Props>;
