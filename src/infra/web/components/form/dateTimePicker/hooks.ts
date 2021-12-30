import type { WithControlProps } from '#/form/withControl';
import type { ReactDatePickerProps } from 'react-datepicker';
import type { FieldValues } from 'react-hook-form';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';

export type Props = Omit<ReactDatePickerProps, 'selected' | 'onChange'>;

const dateFormat = (props: Props) => {
  if (props.showTimeSelectOnly) {
    return 'HH:mm';
  }

  if (props.showTimeSelect) {
    return 'yyyy/MM/dd HH:mm';
  }

  return 'yyyy/MM/dd';
};

export const useHooks = <T extends FieldValues>(props: WithControlProps<Props, T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  const { field, fieldState, formState, isInvalid, isDisabled, isRequired, label, ...dateTimePickerProps } = {
    showTimeSelect: true,
    portalId: 'data-time-picker-portal',
    preventOpenOnFocus: true,
    open: isOpen,
    onInputClick: handleOpen,
    onClickOutside: handleClose,
    withPortal: true,
    ...props,
  };
  const date = useMemo(() => dayjs(props.field.value).toDate(), [props.field.value]);

  return {
    date,
    onChange: props.field.onChange,
    format: dateFormat(dateTimePickerProps),
    dateTimePickerProps,
    isInvalid,
  };
};

export type HooksParams = ReturnType<typeof useHooks>;
