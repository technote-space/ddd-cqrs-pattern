import { renderHook } from '@testing-library/react-hooks';
import { container } from 'tsyringe';
import * as darkModeHooks from '@/web/theme/drakMode';
import { useColor } from '.';

describe('useColor', () => {
  it('ダークモードがOFFの場合にライトモードの色が取得される', () => {
    container.registerInstance('ThemeColor', {
      primary: {
        light: '#6200ee',
      },
    });
    jest.spyOn(darkModeHooks, 'useDarkMode').mockImplementation(() => false);

    const result = renderHook(() => useColor('primary')).result;

    expect(result.current).toBe('#6200ee');
  });

  it('ダークモードがONの場合にダークモードの色が取得される', () => {
    container.registerInstance('ThemeColor', {
      primary: {
        dark: '#5200ae',
      },
    });
    jest.spyOn(darkModeHooks, 'useDarkMode').mockImplementation(() => true);

    const result = renderHook(() => useColor('primary')).result;

    expect(result.current).toBe('#5200ae');
  });
});
