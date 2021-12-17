import type { Text as TextType } from '$/web/components/text';
import { Text as NBText } from 'native-base';
import { memo } from 'react';
import { useColor } from '@/web/theme/color';

const Text: TextType = ({ children, style }) => {
  const textColor = useColor('text');
  return <NBText style={{ ...{ color: textColor }, ...style }}>
    {children}
  </NBText>;
};

Text.displayName = 'TextComponent';
export default memo(Text);
