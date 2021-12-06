import type { ILoadingContext } from '$/web/shared/loading';
import { renderHook } from '@testing-library/react-hooks';
import * as redux from 'react-redux';
import renderer from 'react-test-renderer';
import { Loading, LoadingContext, LoadingComponent } from '.';

jest.mock('react-redux');

describe('LoadingContext', () => {
  const context = new LoadingContext();

  it('key が loading', () => {
    expect(context.getKey()).toBe('loading');
  });

  it('process の初期値は 空の配列', () => {
    expect(context.getInitialState()).toEqual({ process: [] });
  });

  it('ADD_LOADING で process に追加される', () => {
    const mapper = context.getReducerMapObject();
    const store1 = { process: [] };
    const store2 = { process: [{ id: 'abc', message: 'def' }] };
    const process = { id: 'test-id', message: 'test message' };

    expect(mapper).toHaveProperty('ADD_LOADING');
    expect(typeof mapper['ADD_LOADING']).toBe('function');
    expect(mapper['ADD_LOADING'](store1, { type: 'ADD_LOADING', ...process })).toEqual({ process: [process] });
    expect(mapper['ADD_LOADING'](store2, { type: 'ADD_LOADING', ...process })).toEqual({
      process: [{
        id: 'abc',
        message: 'def',
      }, process],
    });
    expect(mapper['ADD_LOADING'](undefined, { type: 'ADD_LOADING', ...process })).toEqual({ process: [process] });
  });

  it('DELETE_LOADING で process から削除される', () => {
    const mapper = context.getReducerMapObject();
    const store1 = { process: [] };
    const store2 = { process: [{ id: 'abc', message: 'def' }] };

    expect(mapper).toHaveProperty('DELETE_LOADING');
    expect(typeof mapper['DELETE_LOADING']).toBe('function');
    expect(mapper['DELETE_LOADING'](store1, { type: 'DELETE_LOADING', id: 'abc' })).toEqual({ process: [] });
    expect(mapper['DELETE_LOADING'](store2, { type: 'DELETE_LOADING', id: 'abc' })).toEqual({ process: [] });
    expect(mapper['DELETE_LOADING'](store2, { type: 'DELETE_LOADING', id: 'xyz' })).toEqual({
      process: [
        { id: 'abc', message: 'def' }],
    });
    expect(mapper['DELETE_LOADING'](undefined, { type: 'DELETE_LOADING', id: 'abc' })).toEqual({ process: [] });
  });

  it('UPDATE_LOADING で process が更新される', () => {
    const mapper = context.getReducerMapObject();
    const store1 = { process: [] };
    const store2 = { process: [{ id: 'abc', message: 'def' }] };
    const process = { id: 'test-id', message: 'test message' };

    expect(mapper).toHaveProperty('UPDATE_LOADING');
    expect(typeof mapper['UPDATE_LOADING']).toBe('function');
    expect(mapper['UPDATE_LOADING'](store1, {
      type: 'UPDATE_LOADING',
      id: 'abc',
      value: process,
    })).toEqual({ process: [] });
    expect(mapper['UPDATE_LOADING'](store2, {
      type: 'UPDATE_LOADING',
      id: 'abc',
      value: process,
    })).toEqual({ process: [process] });
    expect(mapper['UPDATE_LOADING'](store2, {
      type: 'UPDATE_LOADING',
      id: 'xyz',
      value: process,
    })).toEqual({ process: [{ id: 'abc', message: 'def' }] });
    expect(mapper['UPDATE_LOADING'](undefined, {
      type: 'UPDATE_LOADING',
      id: 'abc',
      value: process,
    })).toEqual({ process: [] });
  });

  it('永続化の対象はなし', () => {
    expect(context.persistTargets()).toEqual([]);
  });

  it('process の値を取得する', () => {
    jest.spyOn(redux, 'useSelector').mockImplementation(() => []);

    expect(context.useProcess()).toEqual([]);
  });

  it('process を追加する', () => {
    const mockDispatch = jest.fn();

    context.add(mockDispatch, 'id', 'message');

    expect(mockDispatch).toBeCalledWith({ type: 'ADD_LOADING', id: 'id', message: 'message' });
  });

  it('process を削除する', () => {
    const mockDispatch = jest.fn();

    context.delete(mockDispatch, 'id');

    expect(mockDispatch).toBeCalledWith({ type: 'DELETE_LOADING', id: 'id' });
  });

  it('process を更新する', () => {
    const mockDispatch = jest.fn();

    context.update(mockDispatch, 'id', { message: 'new message', progress: 50 });

    expect(mockDispatch).toBeCalledWith({
      type: 'UPDATE_LOADING',
      id: 'id',
      value: { message: 'new message', progress: 50 },
    });
  });
});

describe('Loading', () => {
  it('ダークモードがOFFの場合はライトモードの値が返る', async () => {
    const mockAdd = jest.fn();
    const mockDelete = jest.fn();
    const mockCallback = jest.fn(() => Promise.resolve('test'));
    const loading = new Loading({ add: mockAdd, delete: mockDelete } as never as ILoadingContext);

    const result = renderHook(() => loading.useLoading()).result;
    expect(await result.current(mockCallback, 'message')).toBe('test');
    expect(await result.current(mockCallback, 'message', 'test')).toBe('test');
    expect(mockCallback).toBeCalledTimes(2);
    expect(mockAdd).toBeCalledTimes(2);
    expect(mockDelete).toBeCalledTimes(2);
  });

  it('プロセスが実行中かどうかの判定が正しい', () => {
    const loading = new Loading({} as ILoadingContext);

    expect(loading.isProcessRunning('test', [])).toBe(false);
    expect(loading.isProcessRunning('test', [{ id: 'aaa' }])).toBe(false);
    expect(loading.isProcessRunning('test', [{ id: 'test' }])).toBe(true);
    expect(loading.isProcessRunning('test', [{ id: 'test' }, { id: 'aaa' }])).toBe(true);
  });
});

describe('LoadingComponent', () => {
  it('ローディング用 View を描画する', () => {
    const mockUseProcess = jest.fn(() => []);
    const component = new LoadingComponent({ useProcess: mockUseProcess } as never as ILoadingContext);

    const tree = renderer.create(component.render({}));
    expect(tree).toMatchSnapshot();
    expect(mockUseProcess).toBeCalledTimes(1);
  });
});
