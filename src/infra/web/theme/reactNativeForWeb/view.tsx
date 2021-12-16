import type { HooksParams } from './hooks';
import type { FC } from 'react';
import { NativeBaseProvider } from 'native-base';
import { memo } from 'react';
import { View as RNView } from 'react-native';


const View: FC<HooksParams> = ({ children, styles }) => {
  return <NativeBaseProvider>
    <RNView style={styles.root}>
      {children}
    </RNView>
  </NativeBaseProvider>;
};

View.displayName = 'ReactNativeForWebThemeView';
export default memo(View);
