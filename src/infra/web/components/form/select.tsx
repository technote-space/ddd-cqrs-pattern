import type { WithControlProps } from '#/form/withControl';
import type { ISelectProps } from 'native-base';
import type { ReactElement } from 'react';
import { Select as NBSelect } from 'native-base';
import { useMemo } from 'react';
import WithControl, { extractComponentProps } from '#/form/withControl';

type Props = ISelectProps & {
  placeholder?: string;
  items: string[];
};

const Select = ({
  placeholder,
  items,
  variant,
  label,
  isDisabled,
  ...props
}: WithControlProps<Props>): ReactElement => {
  return <NBSelect
    placeholder={placeholder ?? label ? `${label}を選択してください` : undefined}
    variant={variant ?? 'outline'}
    isDisabled={isDisabled}
    onValueChange={props.field.onChange}
    selectedValue={props.field.value ?? ''}
    {...extractComponentProps(props)}
  >
    {useMemo(() => items.map((item, index) => <NBSelect.Item key={index} label={item} value={item}/>), [items])}
  </NBSelect>;
};

export default WithControl(Select);
