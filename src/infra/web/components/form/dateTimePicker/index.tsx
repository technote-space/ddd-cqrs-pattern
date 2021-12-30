import type { WithControlProps } from '#/form/withControl';
import type { Props } from './hooks';
import type { ReactElement } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useHooks } from './hooks';
import View from './view';
import WithControl from '#/form/withControl';

const DateTimePicker = <T extends FieldValues>(props: WithControlProps<Props, T>): ReactElement =>
  <View {...useHooks(props)}/>;

export default WithControl(DateTimePicker);
