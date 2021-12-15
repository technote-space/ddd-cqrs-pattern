import type {
  StoreContext,
  useDarkMode as useDarkModeType,
  useToggleDarkMode as useToggleDarkModeType,
} from '$/web/theme/darkMode';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DarkModeContext } from '.';

export const useDarkMode: useDarkModeType = () => {
  /* istanbul ignore next */
  const selector = (state: { darkMode: StoreContext }) => state.darkMode.darkMode;
  return useSelector(selector);
};

export const useToggleDarkMode: useToggleDarkModeType = () => {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch({ type: DarkModeContext.TOGGLE_DARK_MODE });
  }, [dispatch]);
};
