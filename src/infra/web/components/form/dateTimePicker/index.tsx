import type { WithControlProps } from '#/form/withControl';
import type { Props } from './hooks';
import type { ReactElement } from 'react';
import WithControl from '#/form/withControl';
import { useHooks } from './hooks';
import View from './view';

const DateTimePicker = (props: WithControlProps<Props>): ReactElement =>
  <View {...useHooks(props)}/>;

export default WithControl(DateTimePicker);
