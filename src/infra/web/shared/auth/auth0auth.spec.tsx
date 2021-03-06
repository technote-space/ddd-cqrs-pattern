import type { StoreContext, UserResult } from '$/web/shared/auth';
import * as auth0 from '@auth0/auth0-react';
import { renderHook } from '@testing-library/react-hooks';
import * as redux from 'react-redux';
import renderer from 'react-test-renderer';
import * as loadingHooks from '@/web/shared/loading';
import { TestApi } from '^/__mocks__/api';
import TestEnv from '^/__mocks__/env';
import { createLocalHandler, useMockServer } from '^/__mocks__/server';
import { Auth0Auth, Auth0ContextProvider, AuthContext } from './auth0auth';

jest.mock('react-redux');

describe('AuthContext', () => {
  const context = new AuthContext();

  it('key が auth', () => {
    expect(context.getKey()).toBe('auth');
  });

  it('user の初期値は isLoggedIn = false', () => {
    expect(context.getInitialState()).toEqual({ user: { isLoggedIn: false } });
  });

  it('SET_USER で user 情報が設定', () => {
    const mapper = context.getReducerMapObject();
    const store = { user: { isLoggedIn: false } } as StoreContext;
    const user = { isLoggedIn: true, user: { authorization: 'authorization' } };

    expect(mapper).toHaveProperty('SET_USER');
    expect(typeof mapper['SET_USER']).toBe('function');
    expect(mapper['SET_USER'](store, { type: 'SET_USER', user })).toEqual({ user });
    expect(mapper['SET_USER'](undefined, { type: 'SET_USER', user })).toEqual({ user });
  });

  it('永続化の対象は user', () => {
    expect(context.persistTargets()).toEqual(['user']);
  });

  it('user の値を取得する', () => {
    jest.spyOn(redux, 'useSelector').mockImplementation(() => ({ isLoggedIn: false }));

    expect(context.useUser()).toEqual({ isLoggedIn: false });
  });

  it('user の値を更新する', () => {
    const mockDispatch = jest.fn();
    const user = { isLoggedIn: false } as UserResult;

    context.setUser(mockDispatch, user);

    expect(mockDispatch).toBeCalledWith({ type: 'SET_USER', user });
  });
});

describe('Auth0Auth', () => {
  it('Auth0がローディング中の場合にLoadingContextにローディング中のプロセス登録される', () => {
    jest.spyOn(auth0, 'useAuth0').mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
      error: undefined,
      getAccessTokenSilently: jest.fn(),
      loginWithRedirect: jest.fn(),
    } as never);

    const mockAdd = jest.fn();
    const mockDelete = jest.fn();
    jest.spyOn(loadingHooks, 'useLoading').mockReturnValue(jest.fn());
    jest.spyOn(loadingHooks, 'useAddProcess').mockReturnValue(mockAdd);
    jest.spyOn(loadingHooks, 'useDeleteProcess').mockReturnValue(mockDelete);
    jest.spyOn(loadingHooks, 'useIsProcessRunning').mockReturnValue(jest.fn());
    const auth = new Auth0Auth(
      { useUser: () => ({ isLoggedIn: false }) } as never,
      new TestApi(),
    );

    const result = renderHook(() => auth.useUser()).result;

    expect(result.current).toEqual({ isLoggedIn: false });
    expect(mockAdd).toBeCalledTimes(1);
    expect(mockDelete).not.toBeCalled();
  });

  describe('Auth0のロードが完了', () => {
    useMockServer([
      createLocalHandler('post', '/login', 200, {
        authorization: 'token',
      }),
    ]);

    describe('Auth0にログイン成功', () => {
      it('未ログイン状態の場合でまだログインを試みていない場合はログイン', async () => {
        jest.spyOn(auth0, 'useAuth0').mockReturnValue({
          isLoading: false,
          isAuthenticated: true,
          error: undefined,
          getAccessTokenSilently: jest.fn(),
          loginWithRedirect: jest.fn(),
        } as never);

        const mockWithLoading = jest.fn(callback => callback());
        const mockAdd = jest.fn();
        const mockDelete = jest.fn();
        const mockSetUser = jest.fn();
        const mockIsProcessRunning = jest.fn(() => false);
        jest.spyOn(loadingHooks, 'useLoading').mockReturnValue(mockWithLoading);
        jest.spyOn(loadingHooks, 'useAddProcess').mockReturnValue(mockAdd);
        jest.spyOn(loadingHooks, 'useDeleteProcess').mockReturnValue(mockDelete);
        jest.spyOn(loadingHooks, 'useIsProcessRunning').mockReturnValue(mockIsProcessRunning);
        const auth = new Auth0Auth(
          { useUser: () => ({ isLoggedIn: false }), setUser: mockSetUser } as never,
          new TestApi(),
        );

        const { result, waitFor } = renderHook(() => auth.useUser());

        expect(result.current).toEqual({ isLoggedIn: false });
        expect(mockAdd).not.toBeCalled();
        expect(mockDelete).toBeCalledTimes(1);

        expect(mockWithLoading).toBeCalledTimes(2);
        await waitFor(() => expect(mockSetUser).toBeCalledTimes(1));
        expect(mockSetUser).toBeCalledWith(undefined, { user: { authorization: 'token' }, isLoggedIn: true });
      });

      it('未ログイン状態の場合ですでにログインを試みている場合はログインしない', () => {
        jest.spyOn(auth0, 'useAuth0').mockReturnValue({
          isLoading: false,
          isAuthenticated: true,
          error: undefined,
          getAccessTokenSilently: jest.fn(),
          loginWithRedirect: jest.fn(),
        } as never);

        const mockWithLoading = jest.fn(callback => callback());
        const mockAdd = jest.fn();
        const mockDelete = jest.fn();
        const mockSetUser = jest.fn();
        const mockIsProcessRunning = jest.fn(() => true);
        jest.spyOn(loadingHooks, 'useLoading').mockReturnValue(mockWithLoading);
        jest.spyOn(loadingHooks, 'useAddProcess').mockReturnValue(mockAdd);
        jest.spyOn(loadingHooks, 'useDeleteProcess').mockReturnValue(mockDelete);
        jest.spyOn(loadingHooks, 'useIsProcessRunning').mockReturnValue(mockIsProcessRunning);
        const auth = new Auth0Auth(
          { useUser: () => ({ isLoggedIn: false }), setUser: mockSetUser } as never,
          new TestApi(),
        );

        const { result } = renderHook(() => auth.useUser());

        expect(result.current).toEqual({ isLoggedIn: false });
        expect(mockAdd).not.toBeCalled();
        expect(mockDelete).toBeCalledTimes(1);

        expect(mockWithLoading).not.toBeCalled();
      });
    });

    describe('Auth0にログイン失敗', () => {
      it('ログイン状態の場合はログアウト', () => {
        const mockLoginWithRedirect = jest.fn();
        jest.spyOn(auth0, 'useAuth0').mockReturnValue({
          isLoading: false,
          isAuthenticated: false,
          error: new Error(),
          getAccessTokenSilently: jest.fn(),
          loginWithRedirect: mockLoginWithRedirect,
        } as never);

        const mockWithLoading = jest.fn(callback => callback());
        const mockAdd = jest.fn();
        const mockDelete = jest.fn();
        const mockSetUser = jest.fn();
        const mockIsProcessRunning = jest.fn(() => false);
        jest.spyOn(loadingHooks, 'useLoading').mockReturnValue(mockWithLoading);
        jest.spyOn(loadingHooks, 'useAddProcess').mockReturnValue(mockAdd);
        jest.spyOn(loadingHooks, 'useDeleteProcess').mockReturnValue(mockDelete);
        jest.spyOn(loadingHooks, 'useIsProcessRunning').mockReturnValue(mockIsProcessRunning);
        const auth = new Auth0Auth(
          {
            useUser: () => ({ isLoggedIn: true, user: { authorization: 'token' } }),
            setUser: mockSetUser,
          } as never,
          new TestApi(),
        );

        const { result } = renderHook(() => auth.useUser());

        expect(result.current).toEqual({ isLoggedIn: true, user: { authorization: 'token' } });
        expect(mockAdd).not.toBeCalled();
        expect(mockDelete).toBeCalledTimes(1);

        expect(mockWithLoading).not.toBeCalled();
        expect(mockSetUser).toBeCalledWith(undefined, { isLoggedIn: false });
        expect(mockLoginWithRedirect).not.toBeCalled();
      });

      it('エラーではない場合はログインページにリダイレクト', () => {
        const mockLoginWithRedirect = jest.fn(() => Promise.resolve());
        jest.spyOn(auth0, 'useAuth0').mockReturnValue({
          isLoading: false,
          isAuthenticated: false,
          error: undefined,
          getAccessTokenSilently: jest.fn(),
          loginWithRedirect: mockLoginWithRedirect,
        } as never);

        const mockWithLoading = jest.fn(callback => callback());
        const mockAdd = jest.fn();
        const mockDelete = jest.fn();
        const mockSetUser = jest.fn();
        const mockIsProcessRunning = jest.fn(() => false);
        jest.spyOn(loadingHooks, 'useLoading').mockReturnValue(mockWithLoading);
        jest.spyOn(loadingHooks, 'useAddProcess').mockReturnValue(mockAdd);
        jest.spyOn(loadingHooks, 'useDeleteProcess').mockReturnValue(mockDelete);
        jest.spyOn(loadingHooks, 'useIsProcessRunning').mockReturnValue(mockIsProcessRunning);
        const auth = new Auth0Auth(
          {
            useUser: () => ({ isLoggedIn: false }),
            setUser: mockSetUser,
          } as never,
          new TestApi(),
        );

        const { result } = renderHook(() => auth.useUser());

        expect(result.current).toEqual({ isLoggedIn: false });
        expect(mockAdd).not.toBeCalled();
        expect(mockDelete).toBeCalledTimes(1);

        expect(mockWithLoading).not.toBeCalled();
        expect(mockSetUser).not.toBeCalled();
        expect(mockLoginWithRedirect).toBeCalledTimes(1);
      });
    });
  });

  it('ログアウトが呼ばれる', () => {
    const mockLogout = jest.fn();
    jest.spyOn(auth0, 'useAuth0').mockReturnValue({
      logout: mockLogout,
    } as never);

    const auth = new Auth0Auth(
      {} as never,
      {} as never,
    );

    const result = renderHook(() => auth.useLogout()).result;
    result.current();

    expect(mockLogout).toBeCalledTimes(1);
  });
});

describe('Auth0ContextProvider', () => {
  it('Authのコンテキストプロバイダー', () => {
    const auth = new Auth0ContextProvider(
      new TestEnv({}),
      { domain: '', clientId: '' },
    );

    const Provider = auth.getProvider();
    const tree = renderer.create(<Provider>test</Provider>);
    expect(tree).toMatchSnapshot();
  });
});
