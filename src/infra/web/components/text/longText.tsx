import type { ITextAreaProps } from 'native-base/lib/typescript/components/primitives/TextArea';
import type { FC } from 'react';
import { Box } from 'native-base';

export type { ITextAreaProps };
const LongText: FC<ITextAreaProps> = ({ children, ...props }) => {
  return <Box whiteSpace="pre" my={2} mx={1} {...props}>
    {children}
  </Box>;
};
LongText.displayName = 'LongText';
export default LongText;
