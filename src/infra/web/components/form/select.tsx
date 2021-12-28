import type { WithControlProps } from '#/form/withControl';
import type { ISelectProps } from 'native-base';
import type { ReactElement } from 'react';
import type { FieldValues } from 'react-hook-form';
import { Select as NBSelect } from 'native-base';
import { useMemo } from 'react';
import WithControl from '#/form/withControl';

type Props = {
  placeholder?: string;
  variant?: ISelectProps['variant'];
  items: string[];
};

const Select = <T extends FieldValues>({
  placeholder,
  variant,
  items,
  label,
  isDisabled,
  field,
}: WithControlProps<Props, T>): ReactElement => {
  return <NBSelect
    placeholder={placeholder ?? label ? `${label}を選択してください` : undefined}
    variant={variant ?? 'outline'}
    isDisabled={isDisabled}
    onValueChange={field.onChange}
    selectedValue={field.value ?? ''}
  >
    {useMemo(() => items.map((item, index) => <NBSelect.Item key={index} label={item} value={item}/>), [items])}
  </NBSelect>;
};

export default WithControl(Select);
