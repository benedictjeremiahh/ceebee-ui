'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { useLabels } from '../lib/labels.js';
import { cn, type Size } from '../lib/cn.js';
import { useFieldWiring } from './field.js';
import { formatISO, isOutOfRange, isSameDay, monthMatrix, parseDateInput } from './date.util.js';

export interface DateInputProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
  min?: Date;
  max?: Date;
  /** How the chosen date reads in the field. Defaults to the viewer's locale, medium length. */
  format?: (date: Date) => string;
  weekStartsOn?: 0 | 1;
  size?: Size;
  disabled?: boolean;
  invalid?: boolean;
  placeholder?: string;
  className?: string;
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

/**
 * Typing and picking, both. Typing is what fast people do and what a date of birth needs; the
 * calendar is for "the second Tuesday" questions a text field cannot answer.
 */
export function DatePicker({
  value,
  defaultValue = null,
  onValueChange,
  min,
  max,
  format,
  weekStartsOn = 1,
  size = 'md',
  disabled,
  invalid,
  placeholder = 'dd/mm/yyyy',
  className,
}: DateInputProps) {
  const field = useFieldWiring();
  const labels = useLabels();
  const controlled = value !== undefined;
  const [internal, setInternal] = useState<Date | null>(defaultValue);
  const current = controlled ? (value ?? null) : internal;

  const display = (date: Date) =>
    format ? format(date) : date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });

  const [text, setText] = useState(() => (current ? display(current) : ''));
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(() => current ?? new Date());
  // The calendar anchors to the whole field, not to the little button, so it lines up with the
  // control whichever way it was opened.
  const fieldRef = useRef<HTMLDivElement>(null);

  const commit = (next: Date | null) => {
    if (!controlled) setInternal(next);
    setText(next ? display(next) : '');
    onValueChange?.(next);
  };

  const weeks = monthMatrix(cursor.getFullYear(), cursor.getMonth(), weekStartsOn);
  const weekdays = weekStartsOn === 1 ? WEEKDAYS : [WEEKDAYS[6]!, ...WEEKDAYS.slice(0, 6)];

  return (
    <BasePopover.Root open={open} onOpenChange={setOpen}>
      <div
        ref={fieldRef}
        className={cn('cb-date', `cb-date--${size}`, className)}
        data-disabled={disabled || undefined}
      >
        <input
          className="cb-date__input"
          id={field?.controlId}
          value={controlled ? (current ? display(current) : text) : text}
          placeholder={placeholder}
          disabled={disabled}
          aria-describedby={field?.describedBy}
          aria-invalid={invalid ?? field?.invalid ? true : undefined}
          // Clicking the field opens the calendar too — the button is a second way in, not the
          // only one — while typing still works because the input keeps focus.
          onClick={() => !disabled && setOpen(true)}
          onChange={(event) => setText(event.target.value)}
          onBlur={() => {
            // An unparseable string clears rather than silently keeping the old date.
            const parsed = parseDateInput(text);
            if (parsed && !isOutOfRange(parsed, min, max)) {
              commit(parsed);
              setCursor(parsed);
            } else {
              commit(null);
            }
          }}
        />
        <BasePopover.Trigger
          className="cb-date__trigger"
          aria-label={labels.chooseDate}
          disabled={disabled}
          render={<button type="button" />}
        >
          <CalendarDays size={16} />
        </BasePopover.Trigger>
      </div>

      <BasePopover.Portal>
        <BasePopover.Positioner
          anchor={fieldRef}
          side="bottom"
          align="start"
          sideOffset={6}
          className="cb-calendar__positioner"
        >
          <BasePopover.Popup className="cb-calendar">
            <div className="cb-calendar__head">
              <button
                type="button"
                className="cb-calendar__nav"
                aria-label={labels.previousMonth}
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
              >
                <ChevronLeft size={16} />
              </button>
              <p className="cb-calendar__month" aria-live="polite">
                {cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </p>
              <button
                type="button"
                className="cb-calendar__nav"
                aria-label={labels.nextMonth}
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <table className="cb-calendar__grid">
              <thead>
                <tr>
                  {weekdays.map((day) => (
                    <th key={day} scope="col" abbr={day}>
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, weekIndex) => (
                  <tr key={weekIndex}>
                    {week.map((cell) => {
                      const selected = isSameDay(cell.date, current);
                      const outside = isOutOfRange(cell.date, min, max);
                      return (
                        <td key={cell.date.toISOString()}>
                          <button
                            type="button"
                            className="cb-calendar__day"
                            data-outside={!cell.inMonth || undefined}
                            data-selected={selected || undefined}
                            data-today={isSameDay(cell.date, new Date()) || undefined}
                            disabled={outside}
                            aria-pressed={selected}
                            aria-label={formatISO(cell.date)}
                            onClick={() => {
                              commit(cell.date);
                              setCursor(cell.date);
                              setOpen(false);
                            }}
                          >
                            {cell.date.getDate()}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
