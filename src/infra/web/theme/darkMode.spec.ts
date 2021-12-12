import type { IDarkModeContext } from '$/web/theme/darkMode';
import { renderHook } from '@testing-library/react-hooks';
import * as redux from 'react-redux';
import { DarkMode, DarkModeContext } from './darkMode';

jest.mock('react-redux');

describe('DarkModeContext', () => {
  const context = new DarkModeContext();

  it('key が darkMode', () => {
    expect(context.getKey()).toBe('darkMode');
  });

  it('darkMode の初期値は true', () => {
    expect(context.getInitialState()).toEqual({ darkMode: true });
  });

  it('TOGGLE_DARK_MODE で darkMode が切り替わる', () => {
    const mapper = context.getReducerMapObject();
    const store = { darkMode: true };

    expect(mapper).toHaveProperty('TOGGLE_DARK_MODE');
    expect(typeof mapper['TOGGLE_DARK_MODE']).toBe('function');
    expect(mapper['TOGGLE_DARK_MODE'](store, { type: 'TOGGLE_DARK_MODE' })).toEqual({ darkMode: false });
    expect(mapper['TOGGLE_DARK_MODE'](undefined, { type: 'TOGGLE_DARK_MODE' })).toEqual({ darkMode: true });
  });

  it('永続化の対象は darkMode', () => {
    expect(context.persistTargets()).toEqual(['darkMode']);
  });

  it('darkMode の値を取得する', () => {
    jest.spyOn(redux, 'useSelector').mockImplementation(() => true);

    expect(context.useDarkMode()).toBe(true);
  });

  it('darkMode の値を更新する', () => {
    const mockDispatch = jest.fn();

    context.toggleDarkMode(mockDispatch);

    expect(mockDispatch).toBeCalledWith({ type: 'TOGGLE_DARK_MODE' });
  });
});

describe('DarkMode', () => {
  it('ダークモードがOFFの場合はライトモードの値が返る', () => {
    const darkMode = new DarkMode({ useDarkMode: () => false } as IDarkModeContext);

    const result = renderHook(() => darkMode.useColorModeValue(0, 1)).result;

    expect(result.current).toBe(0);
  });

  it('ダークモードがONの場合はライトモードの値が返る', () => {
    const darkMode = new DarkMode({ useDarkMode: () => true } as IDarkModeContext);

    const result = renderHook(() => darkMode.useColorModeValue(0, 1)).result;

    expect(result.current).toBe(1);
  });

  it('ダークモードを切り替える', () => {
    const mockToggleDarkMode = jest.fn();
    const darkMode = new DarkMode({ toggleDarkMode: mockToggleDarkMode } as never);

    renderHook(() => darkMode.useToggleDarkMode()());

    expect(mockToggleDarkMode).toBeCalledTimes(1);
  });
});
