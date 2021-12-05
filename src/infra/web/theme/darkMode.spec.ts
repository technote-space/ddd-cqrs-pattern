import { renderHook } from '@testing-library/react-hooks';
import { DarkMode } from './darkMode';

describe('DarkMode', () => {
  const darkMode = new DarkMode();

  it('should use color mode value', () => {
    const result = renderHook(() => darkMode.useColorModeValue(0, 1)).result;
    expect(result.current).toBe(0);
  });

  it('should toggle color mode', () => {
    const toggle = darkMode.toggleDarkMode();
    expect(() => toggle()).not.toThrow();
  });
});
