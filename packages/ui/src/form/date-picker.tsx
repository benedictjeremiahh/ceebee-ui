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
  styles,
  popupAlign,
  ...props
}: DatePickerProps<ValueType, IsMultiple> & RefAttributes<DatePickerRef>) {
  const popupStyles: NonNullable<DatePickerProps<ValueType, IsMultiple>['styles']> = (info) => {
    const callerStyles = typeof styles === 'function' ? styles(info) : styles;
    return {
      ...callerStyles,
      popup: {
        ...callerStyles?.popup,
        root: {
          ...callerStyles?.popup?.root,
          maxWidth: 'calc(100vw - var(--cb-space-4) - var(--cb-space-4))',
        },
        container: {
          ...callerStyles?.popup?.container,
          maxWidth: '100%',
          maxHeight: 'calc(100dvh - var(--cb-space-4) - var(--cb-space-4))',
          overflowY: 'auto',
        },
      },
    };
  };

  const handleKeyDown: NonNullable<DatePickerProps<ValueType, IsMultiple>['onKeyDown']> = (
    event,
    preventDefault,
  ) => {
    if (event.key === 'Enter') event.preventDefault();
    onKeyDown?.(event, preventDefault);
  };

  return (
    <AntDatePicker<ValueType, IsMultiple>
      {...props}
      styles={popupStyles}
      popupAlign={{
        offset: [0, 0],
        ...popupAlign,
        overflow: { adjustX: 1, adjustY: 1, shiftX: true, shiftY: true, ...popupAlign?.overflow },
      }}
      onKeyDown={handleKeyDown}
      ref={ref}
    />
  );
}

/** Ant's picker confirms Enter, but leaves the browser's implicit form-submit action enabled. */
export const DatePicker: typeof AntDatePicker = Object.assign(DatePickerRoot, AntDatePicker);
