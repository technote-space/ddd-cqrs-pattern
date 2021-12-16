import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useColor } from '@/web/theme/color';

export const useHooks = () => {
  const backgroundColor = useColor('background');
  const textColor = useColor('text');
  const styles = useMemo(() => StyleSheet.create({
    root: {
      display: 'flex',
      height: '100%',
      overflow: 'hidden',
      backgroundColor,
      color: textColor,
    },
  }), [backgroundColor, textColor]);

  return {
    styles,
  };
};
export type HooksParams = ReturnType<typeof useHooks>;
