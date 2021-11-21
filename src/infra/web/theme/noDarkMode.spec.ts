import { renderHook } from '@testing-library/react-hooks';
import { NoDarkMode } from './noDarkMode';

describe('NoDarkMode', () => {
  const noDarkMode = new NoDarkMode();

  it('should use color mode value', () => {
    const result = renderHook(() => noDarkMode.useColorModeValue(0, 1)).result;
    expect(result.current).toBe(0);
  });

  it('should toggle color mode', () => {
    const toggle = noDarkMode.toggleColorMode();
    expect(() => toggle()).not.toThrow();
  });
});
