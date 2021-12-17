import type { FC } from 'react';
import { NativeBaseProvider } from 'native-base';
import { memo } from 'react';
import ViewComponent from '@/web/components/view';

const View: FC = ({ children }) => {
  return <NativeBaseProvider>
    <ViewComponent style={{
      display: 'flex',
      height: '100%',
      overflow: 'hidden',
    }}>
      {children}
    </ViewComponent>
  </NativeBaseProvider>;
};

View.displayName = 'ReactNativeForWebThemeView';
export default memo(View);
