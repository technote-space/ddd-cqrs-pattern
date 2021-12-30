import type { HooksParams } from './hooks';
import type { VFC } from 'react';
import ja from 'date-fns/locale/ja';
import { Input } from 'native-base';
import { memo } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('ja', ja);

const View: VFC<HooksParams> = ({
  date,
  onChange,
  format,
  dateTimePickerProps,
  isInvalid,
}) => {
  return <DatePicker
    selected={date}
    onChange={onChange}
    disabled={isInvalid}
    dateFormat={format}
    customInput={<Input w="100%"/>}
    {...dateTimePickerProps}
  />;
};

View.displayName = 'DateTimePickerView';
export default memo(View);
