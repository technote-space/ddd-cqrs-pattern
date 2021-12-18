import * as redux from 'react-redux';
import renderer from 'react-test-renderer';
import { LoadingContext, LoadingComponent } from '.';

jest.mock('./view', () => () => null);

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

  it('永続化の対象はなし', () => {
    expect(context.persistTargets()).toEqual([]);
  });
});

describe('LoadingComponent', () => {
  it('ローディング用 View を描画する', () => {
    jest.spyOn(redux, 'useSelector').mockReturnValue([{ message: undefined }, { message: 'message' }]);
    const component = new LoadingComponent();

    const tree = renderer.create(component.render({}));
    expect(tree).toMatchSnapshot();
  });
});
