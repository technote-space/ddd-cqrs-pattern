import type { WithControlProps } from '#/form/withControl';
import type { ITextAreaProps } from 'native-base/lib/typescript/components/primitives/TextArea';
import type { ReactElement } from 'react';
import type { FieldValues } from 'react-hook-form';
import { TextArea as NBTextArea } from 'native-base';
import WithControl from '#/form/withControl';

type Props = {
  placeholder?: string;
  numberOfLines?: ITextAreaProps['numberOfLines'];
};

const TextArea = <T extends FieldValues>({
  placeholder,
  numberOfLines,
  isDisabled,
  field,
}: WithControlProps<Props, T>): ReactElement => {
  return <NBTextArea
    placeholder={placeholder}
    numberOfLines={numberOfLines ?? 5}
    isDisabled={isDisabled}
    onBlur={field.onBlur}
    onChangeText={field.onChange}
    value={field.value ?? ''}
    textAlignVertical="top"
  />;
};

export default WithControl(TextArea);
