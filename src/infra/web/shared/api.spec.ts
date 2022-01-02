import * as useAspidaSWR from '@aspida/swr';
import { renderHook } from '@testing-library/react-hooks';
import * as loadingHooks from '@/web/shared/loading';
import Api from './api';

jest.mock('react-redux');

describe('Api', () => {
  describe('useSWR', () => {
    it('認証エラーのときにユーザー情報をリセットする', async () => {
      const mockSetUser = jest.fn();
      const mockSelector = jest.fn(() => [jest.fn(), []] as never);
      const mockMutate = jest.fn((func) => Promise.resolve(func()));
      jest.spyOn(useAspidaSWR, 'default').mockReturnValue({
        error: { isAxiosError: true, response: { status: 401 } },
        mutate: mockMutate,
      } as never);

      const api = new Api({} as never, { setUser: mockSetUser } as never, {} as never);
      const { result, waitFor } = renderHook(() => api.useSWR(mockSelector));

      await waitFor(expect(mockSetUser).toBeCalled);
      expect(mockSelector).toBeCalled();
      expect(mockMutate).toBeCalled();
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useCaller', () => {
    it('認証エラーのときにユーザー情報をリセットする', async () => {
      class AxiosError extends Error {
        public get isAxiosError() {
          return true;
        }

        public get response() {
          return {
            status: 401,
          };
        }
      }

      const mockSetUser = jest.fn();
      const mockGeneratePromise = jest.fn(() => {
        throw new AxiosError();
      });
      const mockWithLoading = jest.fn(callback => callback());
      jest.spyOn(loadingHooks, 'useLoading').mockReturnValue(mockWithLoading);

      const api = new Api({} as never, { setUser: mockSetUser } as never, { useToast: () => ({ show: jest.fn() }) } as never);
      const caller = renderHook(() => api.useCaller()).result.current;

      expect(await caller(mockGeneratePromise, undefined)).toBeUndefined();
      expect(mockGeneratePromise).toBeCalled();
      expect(mockSetUser).toBeCalled();
    });

    it('認証エラー以外エラーのときにユーザー情報はリセットされない', async () => {
      const mockSetUser = jest.fn();
      const mockGeneratePromise = jest.fn(() => {
        throw new Error();
      });
      const mockShow = jest.fn();

      const api = new Api({} as never, { setUser: mockSetUser } as never, { useToast: () => ({ show: mockShow }) } as never);
      const caller = renderHook(() => api.useCaller()).result.current;

      expect(await caller(mockGeneratePromise, undefined)).toBeUndefined();
      expect(mockGeneratePromise).toBeCalled();
      expect(mockSetUser).not.toBeCalled();
      expect(mockShow).toBeCalled();
    });

    it('fallback が設定されている場合はエラーではなく fallback が返る', async () => {
      const mockSetUser = jest.fn();
      const mockGeneratePromise = jest.fn(() => {
        throw new Error();
      });
      const mockShow = jest.fn();

      const api = new Api({} as never, { setUser: mockSetUser } as never, { useToast: () => ({ show: mockShow }) } as never);
      const caller = renderHook(() => api.useCaller()).result.current;

      expect(await caller(mockGeneratePromise, { test: 123 })).toEqual({ test: 123 });
      expect(mockGeneratePromise).toBeCalled();
      expect(mockSetUser).not.toBeCalled();
      expect(mockShow).toBeCalled();
    });
  });
});
