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
}: WithControlProps<Props>): ReactElement | null => {
  const isLocalDisabled = props.field.value && !items.includes(props.field.value);

  return <NBSelect
    placeholder={placeholder ?? (label ? `${label}を選択してください` : undefined)}
    variant={variant ?? 'outline'}
    isDisabled={isDisabled || isLocalDisabled}
    onValueChange={props.field.onChange}
    selectedValue={props.field.value ?? ''}
    {...extractComponentProps(props)}
  >
    {useMemo(() => (isLocalDisabled ? [props.field.value] : items).map(
      (item, index) => <NBSelect.Item key={index} label={item} value={item}/>,
    ), [items, isLocalDisabled, props.field.value])}
  </NBSelect>;
};

export default WithControl(Select);
