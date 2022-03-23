import type { IHStackProps } from 'native-base/lib/typescript/components/primitives/Stack/HStack';
import type { FC } from 'react';
import { Spinner, HStack, Heading } from 'native-base';

type Props = IHStackProps & {
  message?: string
};

const Loading: FC<Props> = ({ message, ...props }) => {
  return <HStack space={2} my={1} alignItems="center" {...props}>
    <Spinner/>
    <Heading color="primary.500" fontSize="md">{message ?? 'Loading...'}</Heading>
  </HStack>;
};

Loading.displayName = 'Loading';
export default Loading;
