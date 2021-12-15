import { renderHook } from '@testing-library/react-hooks';
import * as redux from 'react-redux';
import { useDarkMode, useToggleDarkMode } from './hooks';

jest.mock('react-redux');

describe('useDarkMode', () => {
  it('darkMode の値を取得する', () => {
    jest.spyOn(redux, 'useSelector').mockImplementation(() => true);

    expect(useDarkMode()).toBe(true);
  });
});

describe('useToggleDarkMode', () => {
  it('ダークモードを切り替える', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(redux, 'useDispatch').mockReturnValue(mockDispatch);

    renderHook(() => useToggleDarkMode()());

    expect(mockDispatch).toBeCalledTimes(1);
  });
});
