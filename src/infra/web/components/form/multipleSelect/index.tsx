import type { WithControlProps } from '#/form/withControl';
import type { Props } from './hooks';
import type { VFC } from 'react';
import { useHooks } from './hooks';
import View from './view';
import WithControl from '#/form/withControl';

const MultiSelect: VFC<WithControlProps<Props>> = (props) => {
  return <View {...useHooks(props)}/>;
};

export default WithControl(MultiSelect);
