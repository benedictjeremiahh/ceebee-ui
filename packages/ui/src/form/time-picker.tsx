'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import { Clock } from 'lucide-react';
import { useRef, useState } from 'react';
import { useLabels } from '../lib/labels.js';
import { cn, type Size } from '../lib/cn.js';
import { useFieldWiring } from './field.js';
import {
  formatTime,
  isTimeOutOfRange,
  parseTime,
  timeOptions,
  timeToMinutes,
  type TimeValue,
} from './time.util.js';

export interface TimeInputProps {
  value?: TimeValue | null;
  defaultValue?: TimeValue | null;
  onValueChange?: (value: TimeValue | null) => void;
  min?: TimeValue;
  max?: TimeValue;
  /** Minutes between the offered times. Typing is never restricted to them. */
  step?: number;
  size?: Size;
  disabled?: boolean;
  invalid?: boolean;
  placeholder?: string;
  className?: string;
}

/**
 * The DatePicker's sibling. Typing accepts what people actually type — `9`, `0930`, `9:30`,
 * `9pm` — and the list is a convenience on top, never the only way to answer.
 */
export function TimePicker({
  value,
  defaultValue = null,
  onValueChange,
  min,
  max,
  step = 30,
  size = 'md',
  disabled,
  invalid,
  placeholder = 'hh:mm',
  className,
}: TimeInputProps) {
  const field = useFieldWiring();
  const labels = useLabels();
  const controlled = value !== undefined;
  const [internal, setInternal] = useState<TimeValue | null>(defaultValue);
  const current = controlled ? (value ?? null) : internal;
  const [text, setText] = useState(() => (current ? formatTime(current) : ''));
  const [open, setOpen] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);

  const commit = (next: TimeValue | null) => {
    if (!controlled) setInternal(next);
    setText(next ? formatTime(next) : '');
    onValueChange?.(next);
  };

  const options = timeOptions(step, min, max);

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
          value={controlled ? (current ? formatTime(current) : text) : text}
          placeholder={placeholder}
          disabled={disabled}
          inputMode="numeric"
          aria-describedby={field?.describedBy}
          aria-invalid={invalid ?? field?.invalid ? true : undefined}
          onClick={() => !disabled && setOpen(true)}
          onChange={(event) => setText(event.target.value)}
          onBlur={() => {
            const parsed = parseTime(text);
            commit(parsed && !isTimeOutOfRange(parsed, min, max) ? parsed : null);
          }}
        />
        <BasePopover.Trigger
          className="cb-date__trigger"
          aria-label={labels.chooseTime}
          disabled={disabled}
          render={<button type="button" />}
        >
          <Clock size={16} />
        </BasePopover.Trigger>
      </div>

      <BasePopover.Portal>
        <BasePopover.Positioner
          anchor={fieldRef}
          side="bottom"
          align="start"
          sideOffset={6}
          className="cb-times__positioner"
        >
          <BasePopover.Popup className="cb-times">
            <ul className="cb-times__list">
              {options.map((option) => {
                const selected = current ? timeToMinutes(current) === timeToMinutes(option) : false;
                return (
                  <li key={formatTime(option)}>
                    <button
                      type="button"
                      className="cb-times__option"
                      data-selected={selected || undefined}
                      aria-pressed={selected}
                      onClick={() => {
                        commit(option);
                        setOpen(false);
                      }}
                    >
                      {formatTime(option)}
                    </button>
                  </li>
                );
              })}
            </ul>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
