"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type KeyboardEvent, type ReactNode, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useLabels } from '../../lib/labels.js';
import { CalendarSkeleton } from './calendar.skeleton.js';

export interface CalendarDay {
  date: Date;
  inMonth: boolean;
  selected: boolean;
  today: boolean;
  disabled: boolean;
}

export interface CalendarProps {
  /** Selected local calendar day. Supplying it makes date selection controlled. */
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date) => void;
  /** Month being displayed. Supplying it makes month navigation controlled. */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDate?: (date: Date) => boolean;
  /** Renders static, noninteractive content inside each day button without changing its grid or selection contract. */
  renderDay?: (day: CalendarDay) => ReactNode;
  locale?: string | string[];
  weekStartsOn?: 0 | 1;
  disabled?: boolean;
}

function isUsableDate(value: Date | null | undefined): value is Date {
  return value instanceof Date && Number.isFinite(value.getTime());
}

function calendarDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function sameDay(left: Date | null | undefined, right: Date | null | undefined) {
  return Boolean(left && right && left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate());
}

function sameMonth(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function addDays(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function addMonths(date: Date, amount: number) {
  const targetYear = date.getFullYear();
  const targetMonth = date.getMonth() + amount;
  const lastDay = new Date(targetYear, targetMonth + 1, 0).getDate();
  return new Date(targetYear, targetMonth, Math.min(date.getDate(), lastDay));
}

function isDisabled(date: Date, minDate?: Date, maxDate?: Date, disabledDate?: (date: Date) => boolean) {
  const day = calendarDay(date);
  return (isUsableDate(minDate) && day < calendarDay(minDate))
    || (isUsableDate(maxDate) && day > calendarDay(maxDate))
    || disabledDate?.(day) === true;
}

function monthCells(month: Date, weekStartsOn: 0 | 1) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const leadingDays = (first.getDay() - weekStartsOn + 7) % 7;
  const start = addDays(first, -leadingDays);
  return Array.from({ length: 42 }, (_, index) => addDays(start, index));
}

function firstEnabledDate(month: Date, weekStartsOn: 0 | 1, minDate?: Date, maxDate?: Date, disabledDate?: (date: Date) => boolean) {
  const cells = monthCells(month, weekStartsOn);
  return cells.find((date) => sameMonth(date, month) && !isDisabled(date, minDate, maxDate, disabledDate))
    ?? cells.find((date) => !isDisabled(date, minDate, maxDate, disabledDate));
}

/** Inline month grid: it owns neither a field, a popup, nor dismissal. */
function CalendarRoot({
  value,
  defaultValue = null,
  onValueChange,
  month,
  defaultMonth,
  onMonthChange,
  minDate,
  maxDate,
  disabledDate,
  renderDay,
  locale,
  weekStartsOn = 1,
  disabled = false,
}: CalendarProps) {
  const labels = useLabels();
  const headingId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const focusKeyRef = useRef<string | undefined>(undefined);
  const today = useMemo(() => calendarDay(new Date()), []);
  const controlledValue = value !== undefined;
  const [internalValue, setInternalValue] = useState<Date | null>(() => (
    isUsableDate(defaultValue) && !isDisabled(defaultValue, minDate, maxDate, disabledDate)
      ? calendarDay(defaultValue)
      : null
  ));
  const requestedValue = controlledValue ? value : internalValue;
  // A constraint always wins over supplied state. Showing a disabled day as selected would tell a
  // person two incompatible things, so an unavailable controlled/default value renders unselected.
  const selected = isUsableDate(requestedValue) && !isDisabled(requestedValue, minDate, maxDate, disabledDate)
    ? calendarDay(requestedValue)
    : null;
  const controlledMonth = month !== undefined;
  const [internalMonth, setInternalMonth] = useState(() => {
    const initial = isUsableDate(defaultMonth) ? defaultMonth : selected ?? today;
    return new Date(initial.getFullYear(), initial.getMonth(), 1);
  });
  const displayedMonth = controlledMonth && isUsableDate(month)
    ? new Date(month.getFullYear(), month.getMonth(), 1)
    : internalMonth;
  const [activeDate, setActiveDate] = useState(() => (
    selected && sameMonth(selected, displayedMonth)
      ? selected
      : firstEnabledDate(displayedMonth, weekStartsOn, minDate, maxDate, disabledDate) ?? displayedMonth
  ));

  const cells = useMemo(() => monthCells(displayedMonth, weekStartsOn), [displayedMonth, weekStartsOn]);
  const rovingDate = cells.some((date) => sameDay(date, activeDate) && !isDisabled(date, minDate, maxDate, disabledDate))
    ? activeDate
    : firstEnabledDate(displayedMonth, weekStartsOn, minDate, maxDate, disabledDate);
  const weekdayFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: 'short' }), [locale]);
  const fullDateFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: 'full' }), [locale]);
  const monthFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }), [locale]);
  const weekdayDates = useMemo(() => Array.from({ length: 7 }, (_, index) => new Date(2023, 0, 1 + ((weekStartsOn + index) % 7))), [weekStartsOn]);
  const controlledMonthKey = controlledMonth ? dateKey(displayedMonth) : undefined;
  const controlledValueKey = controlledValue && selected ? dateKey(selected) : undefined;
  const previousControlledMonthKey = useRef(controlledMonthKey);
  const previousControlledValueKey = useRef(controlledValueKey);

  useEffect(() => {
    const monthChanged = controlledMonth && previousControlledMonthKey.current !== controlledMonthKey;
    const valueChanged = controlledValue && previousControlledValueKey.current !== controlledValueKey;
    previousControlledMonthKey.current = controlledMonthKey;
    previousControlledValueKey.current = controlledValueKey;
    if (!monthChanged && !valueChanged) return;

    const next = selected && sameMonth(selected, displayedMonth)
      ? selected
      : firstEnabledDate(displayedMonth, weekStartsOn, minDate, maxDate, disabledDate);
    if (next) setActiveDate(next);
  }, [controlledMonth, controlledMonthKey, controlledValue, controlledValueKey, disabledDate, displayedMonth, maxDate, minDate, selected, weekStartsOn]);

  useEffect(() => {
    const key = focusKeyRef.current;
    if (!key) return;
    const target = rootRef.current?.querySelector<HTMLButtonElement>(`[data-date-key="${key}"]`);
    if (target) target.focus();
    focusKeyRef.current = undefined;
  }, [displayedMonth, activeDate]);

  const changeMonth = (next: Date) => {
    const normalized = new Date(next.getFullYear(), next.getMonth(), 1);
    if (!controlledMonth) setInternalMonth(normalized);
    onMonthChange?.(normalized);
  };

  const setActive = (next: Date, shouldFocus = false) => {
    const normalized = calendarDay(next);
    const enabled = isDisabled(normalized, minDate, maxDate, disabledDate) ? firstEnabledDate(normalized, weekStartsOn, minDate, maxDate, disabledDate) : normalized;
    if (!enabled) return;
    setActiveDate(enabled);
    if (!sameMonth(enabled, displayedMonth)) changeMonth(enabled);
    if (shouldFocus) focusKeyRef.current = dateKey(enabled);
  };

  const select = (next: Date) => {
    if (disabled || isDisabled(next, minDate, maxDate, disabledDate)) return;
    const normalized = calendarDay(next);
    if (!controlledValue) setInternalValue(normalized);
    onValueChange?.(normalized);
    setActive(normalized);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, current: Date) => {
    if (disabled) return;
    const moveFromCurrent = (amount: number) => {
      const direction = Math.sign(amount);
      let candidate = addDays(current, amount);
      for (let attempts = 0; attempts < 366 && isDisabled(candidate, minDate, maxDate, disabledDate); attempts += 1) {
        candidate = addDays(candidate, direction || 1);
      }
      if (!isDisabled(candidate, minDate, maxDate, disabledDate)) setActive(candidate, true);
    };
    if (event.key === 'ArrowLeft') { event.preventDefault(); moveFromCurrent(-1); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); moveFromCurrent(1); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); moveFromCurrent(-7); }
    else if (event.key === 'ArrowDown') { event.preventDefault(); moveFromCurrent(7); }
    else if (event.key === 'Home') { event.preventDefault(); moveFromCurrent(-((current.getDay() - weekStartsOn + 7) % 7)); }
    else if (event.key === 'End') { event.preventDefault(); moveFromCurrent(6 - ((current.getDay() - weekStartsOn + 7) % 7)); }
    else if (event.key === 'PageUp') { event.preventDefault(); setActive(addMonths(current, event.shiftKey ? -12 : -1), true); }
    else if (event.key === 'PageDown') { event.preventDefault(); setActive(addMonths(current, event.shiftKey ? 12 : 1), true); }
    else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(current); }
  };

  return (
    <section ref={rootRef} className="cb-calendar" aria-label={monthFormatter.format(displayedMonth)} data-disabled={disabled || undefined}>
      <div className="cb-calendar__header">
        <button type="button" className="cb-calendar__nav" onClick={() => changeMonth(addMonths(displayedMonth, -1))} disabled={disabled} aria-label={labels.previousMonth}>
          <ChevronLeft aria-hidden="true" />
        </button>
        <h2 className="cb-calendar__month" id={headingId} aria-live="polite">{monthFormatter.format(displayedMonth)}</h2>
        <button type="button" className="cb-calendar__nav" onClick={() => changeMonth(addMonths(displayedMonth, 1))} disabled={disabled} aria-label={labels.nextMonth}>
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
      <div className="cb-calendar__weekdays" aria-hidden="true">
        {weekdayDates.map((date) => <span key={date.getDay()}>{weekdayFormatter.format(date)}</span>)}
      </div>
      <div className="cb-calendar__grid" role="grid" aria-labelledby={headingId}>
        {Array.from({ length: 6 }, (_, weekIndex) => (
          <div className="cb-calendar__week" role="row" key={weekIndex}>
            {cells.slice(weekIndex * 7, weekIndex * 7 + 7).map((date) => {
              const unavailable = disabled || isDisabled(date, minDate, maxDate, disabledDate);
              const day: CalendarDay = { date, inMonth: sameMonth(date, displayedMonth), selected: sameDay(date, selected), today: sameDay(date, today), disabled: unavailable };
              const active = sameDay(date, rovingDate) && !unavailable;
              return (
                <div role="gridcell" className="cb-calendar__cell" key={dateKey(date)} aria-selected={day.selected || undefined}>
                  <button
                    type="button"
                    className="cb-calendar__day"
                    data-date-key={dateKey(date)}
                    data-outside={!day.inMonth || undefined}
                    data-selected={day.selected || undefined}
                    data-today={day.today || undefined}
                    disabled={unavailable}
                    tabIndex={active ? 0 : -1}
                    aria-label={fullDateFormatter.format(date)}
                    aria-pressed={day.selected}
                    onFocus={() => setActiveDate(date)}
                    onClick={() => select(date)}
                    onKeyDown={(event) => handleKeyDown(event, date)}
                  >
                    {renderDay ? renderDay(day) : date.getDate()}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

export const Calendar = Object.assign(CalendarRoot, { Skeleton: CalendarSkeleton });
