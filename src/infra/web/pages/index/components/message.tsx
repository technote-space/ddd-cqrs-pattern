import type { ITextProps } from 'native-base';
import type { FC } from 'react';
import { Text } from 'native-base';

const Message: FC<ITextProps> = (props) => {
  return <Text {...props}/>;
};

Message.displayName = 'Message';
export default Message;
