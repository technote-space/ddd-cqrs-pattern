import * as useAspidaSWR from '@aspida/swr';
import { renderHook } from '@testing-library/react-hooks';
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

      const api = new Api({} as never, { setUser: mockSetUser } as never);
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

      const api = new Api({} as never, { setUser: mockSetUser } as never);
      const caller = renderHook(() => api.useCaller()).result.current;

      await expect(caller(mockGeneratePromise)).rejects.toThrow();
      expect(mockGeneratePromise).toBeCalled();
      expect(mockSetUser).toBeCalled();
    });

    it('認証エラー以外エラーのときにユーザー情報はリセットされない', async () => {
      const mockSetUser = jest.fn();
      const mockGeneratePromise = jest.fn(() => {
        throw new Error();
      });

      const api = new Api({} as never, { setUser: mockSetUser } as never);
      const caller = renderHook(() => api.useCaller()).result.current;

      await expect(caller(mockGeneratePromise)).rejects.toThrow();
      expect(mockGeneratePromise).toBeCalled();
      expect(mockSetUser).not.toBeCalled();
    });
  });
});
