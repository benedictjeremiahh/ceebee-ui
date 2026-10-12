'use client';

import { DatePicker as AntDatePicker } from 'antd';
import type { DatePickerProps as AntDatePickerProps, GetRef } from 'antd';
import type { RefAttributes } from 'react';
import type { Dayjs } from 'dayjs';

export type DatePickerProps<ValueType = Dayjs, IsMultiple extends boolean = false> =
  AntDatePickerProps<ValueType, IsMultiple>;

type DatePickerRef = GetRef<typeof AntDatePicker>;

function DatePickerRoot<ValueType = Dayjs, IsMultiple extends boolean = false>({
  onKeyDown,
  ref,
  ...props
}: DatePickerProps<ValueType, IsMultiple> & RefAttributes<DatePickerRef>) {
  const handleKeyDown: NonNullable<DatePickerProps<ValueType, IsMultiple>['onKeyDown']> = (
    event,
    preventDefault,
  ) => {
    if (event.key === 'Enter') event.preventDefault();
    onKeyDown?.(event, preventDefault);
  };

  return <AntDatePicker<ValueType, IsMultiple> {...props} onKeyDown={handleKeyDown} ref={ref} />;
}

/** Ant's picker confirms Enter, but leaves the browser's implicit form-submit action enabled. */
export const DatePicker: typeof AntDatePicker = Object.assign(DatePickerRoot, AntDatePicker);
