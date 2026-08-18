'use client';

import { Minus, Plus } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import { cn, type Size } from '../lib/cn.js';
import { useFieldWiring } from './field.js';
import { canStep, clamp, parseNumber, stepBy, type NumberBounds } from './number.js';

export interface NumberInputProps extends NumberBounds {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  size?: Size;
  disabled?: boolean;
  invalid?: boolean;
  name?: string;
  placeholder?: string;
  /** Shown inside the control, e.g. 'kg', 'IDR'. Decorative — keep the unit in the label too. */
  suffix?: string;
  className?: string;
}

/**
 * A text input that speaks numbers, not `<input type="number">`: that one scrolls its value
 * away under the wheel, accepts 'e' and '+', and formats inconsistently across locales.
 */
export function NumberInput({
  value,
  defaultValue = null,
  onValueChange,
  min,
  max,
  step = 1,
  size = 'md',
  disabled,
  invalid,
  name,
  placeholder,
  suffix,
  className,
}: NumberInputProps) {
  const field = useFieldWiring();
  const controlled = value !== undefined;
  const [internal, setInternal] = useState<number | null>(defaultValue);
  const [text, setText] = useState(() => formatValue(controlled ? (value ?? null) : defaultValue));
  const current = controlled ? (value ?? null) : internal;
  const bounds: NumberBounds = { min, max, step };

  const commit = (next: number | null) => {
    if (!controlled) setInternal(next);
    setText(formatValue(next));
    onValueChange?.(next);
  };

  const onType = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    const parsed = parseNumber(event.target.value);
    if (parsed === null) {
      onValueChange?.(null);
      if (!controlled) setInternal(null);
      return;
    }
    // Clamping happens on blur, not while typing: clamping mid-keystroke fights the person.
    if (!controlled) setInternal(parsed);
    onValueChange?.(parsed);
  };

  return (
    <div className={cn('cb-number', `cb-number--${size}`, className)} data-disabled={disabled || undefined}>
      <button
        type="button"
        className="cb-number__step"
        aria-label="Decrease"
        disabled={disabled || !canStep(current, -1, bounds)}
        onClick={() => commit(stepBy(current, -1, bounds))}
      >
        <Minus size={14} />
      </button>

      <input
        className="cb-number__input"
        inputMode="decimal"
        id={field?.controlId}
        name={name}
        value={controlled ? formatValue(value ?? null) : text}
        placeholder={placeholder}
        disabled={disabled}
        aria-describedby={field?.describedBy}
        aria-invalid={invalid ?? field?.invalid ? true : undefined}
        onChange={onType}
        onBlur={() => {
          const parsed = parseNumber(text);
          commit(parsed === null ? null : clamp(parsed, bounds));
        }}
      />

      {suffix ? (
        <span className="cb-number__suffix" aria-hidden="true">
          {suffix}
        </span>
      ) : null}

      <button
        type="button"
        className="cb-number__step"
        aria-label="Increase"
        disabled={disabled || !canStep(current, 1, bounds)}
        onClick={() => commit(stepBy(current, 1, bounds))}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

function formatValue(value: number | null): string {
  return value === null ? '' : String(value);
}
