import type { Heading as HeadingType } from '$/web/components/heading';
import { Heading as NBHeading } from 'native-base';
import { memo } from 'react';
import { useColor } from '@/web/theme/color';

const Heading: HeadingType = ({ children, style }) => {
  const textColor = useColor('text');
  return <NBHeading style={{ ...{ color: textColor }, ...style }}>
    {children}
  </NBHeading>;
};

Heading.displayName = 'HeadingComponent';
export default memo(Heading);
