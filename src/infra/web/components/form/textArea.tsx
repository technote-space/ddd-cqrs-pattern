import type { WithControlProps } from '#/form/withControl';
import type { ITextAreaProps } from 'native-base/lib/typescript/components/primitives/TextArea';
import type { ReactElement } from 'react';
import { TextArea as NBTextArea } from 'native-base';
import WithControl, { extractComponentProps } from '#/form/withControl';

type Props = ITextAreaProps & {
  placeholder?: string;
};

const TextArea = ({
  placeholder,
  numberOfLines,
  label,
  isDisabled,
  ...props
}: WithControlProps<Props>): ReactElement => {
  return <NBTextArea
    placeholder={placeholder ?? (label ? `${label}を入力してください` : undefined)}
    numberOfLines={numberOfLines ?? 5}
    isDisabled={isDisabled}
    onBlur={props.field.onBlur}
    onChangeText={props.field.onChange}
    value={props.field.value ?? ''}
    textAlignVertical="top"
    {...extractComponentProps(props)}
  />;
};

export default WithControl(TextArea);
