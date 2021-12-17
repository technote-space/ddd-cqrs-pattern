import type { View as ViewType } from '$/web/components/view';
import { View as NBView } from 'native-base';
import { memo } from 'react';
import { useColor } from '@/web/theme/color';

const View: ViewType = ({ children, style }) => {
  const backgroundColor = useColor('background');
  const textColor = useColor('text');
  return <NBView style={{ ...{ backgroundColor, color: textColor }, ...style }}>
    {children}
  </NBView>;
};

View.displayName = 'ViewComponent';
export default memo(View);
