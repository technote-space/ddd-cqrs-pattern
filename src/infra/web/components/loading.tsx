import type { FC } from 'react';
import { Spinner, HStack, Heading } from 'native-base';

const Loading: FC<{ message?: string }> = ({ message }) => {
  return <HStack space={2} my={1} alignItems="center">
    <Spinner/>
    <Heading color="primary.500" fontSize="md">{message ?? 'Loading...'}</Heading>
  </HStack>;
};

Loading.displayName = 'Loading';
export default Loading;
