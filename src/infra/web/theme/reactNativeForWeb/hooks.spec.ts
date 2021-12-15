import { renderHook } from '@testing-library/react-hooks';
import * as colorHooks from '@/web/theme/color';
import { useHooks } from './hooks';

describe('useHooks', () => {
  it('Viewで使用するパラメータを返す', () => {
    jest.spyOn(colorHooks, 'useColor').mockReturnValue('#000');

    const result = renderHook(() => useHooks()).result;

    expect(result.current).toEqual({
      styles: {
        root: {
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          backgroundColor: '#000',
          color: '#000',
        },
      },
    });
  });
});
