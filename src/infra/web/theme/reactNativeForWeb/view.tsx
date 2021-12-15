import type { HooksParams } from './hooks';
import type { FC } from 'react';
import { memo } from 'react';
import { View as RNView } from 'react-native';

const View: FC<HooksParams> = ({ children, styles }) => {
  return <RNView style={styles.root}>
    {children}
  </RNView>;
};

View.displayName = 'ReactNativeForWebThemeView';
export default memo(View);
