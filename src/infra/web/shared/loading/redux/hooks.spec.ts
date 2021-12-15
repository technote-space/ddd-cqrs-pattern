import { renderHook } from '@testing-library/react-hooks';
import * as redux from 'react-redux';
import { useProcess, useAddProcess, useDeleteProcess, useLoading, useIsProcessRunning } from './hooks';

jest.mock('react-redux');

describe('useProcess', () => {
  it('process の値を取得する', () => {
    jest.spyOn(redux, 'useSelector').mockImplementation(() => []);

    expect(useProcess()).toEqual([]);
  });
});

describe('useAddProcess', () => {
  it('process を追加する', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(redux, 'useDispatch').mockReturnValue(mockDispatch);
    const result = renderHook(() => useAddProcess()).result;

    result.current('id', 'message');

    expect(mockDispatch).toBeCalledWith({ type: 'ADD_LOADING', id: 'id', message: 'message' });
  });
});

describe('useDeleteProcess', () => {
  it('process を削除する', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(redux, 'useDispatch').mockReturnValue(mockDispatch);
    const result = renderHook(() => useDeleteProcess()).result;

    result.current('id');

    expect(mockDispatch).toBeCalledWith({ type: 'DELETE_LOADING', id: 'id' });
  });
});

describe('useLoading', () => {
  it('callback の返り値が取得され、プロセスの追加と削除が実行される', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(redux, 'useDispatch').mockReturnValue(mockDispatch);
    const mockCallback = jest.fn(() => Promise.resolve('test'));

    const result = renderHook(() => useLoading()).result;
    expect(await result.current(mockCallback, 'message')).toBe('test');
    expect(await result.current(mockCallback, 'message', 'test')).toBe('test');
    expect(mockCallback).toBeCalledTimes(2);
    expect(mockDispatch).toBeCalledTimes(4);
  });
});

describe('useIsProcessRunning', () => {
  it('プロセスが実行中かどうかの判定が正しい', () => {
    jest.spyOn(redux, 'useSelector').mockImplementation(() => [{ id: 'test' }]);

    const result = renderHook(() => useIsProcessRunning()).result;

    expect(result.current('test')).toBe(true);
    expect(result.current('aaa')).toBe(false);
  });
});
