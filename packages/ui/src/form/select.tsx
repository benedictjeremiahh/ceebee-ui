'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import { Check, ChevronsUpDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn, type Size } from '../lib/cn.js';
import { useFieldWiring } from './field.js';

export interface SelectOption<T extends string = string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps<T extends string = string> {
  items: Array<SelectOption<T>>;
  value?: T | null;
  defaultValue?: T | null;
  onValueChange?: (value: T) => void;
  placeholder?: string;
  size?: Size;
  disabled?: boolean;
  invalid?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

/**
 * Listbox behaviour — typeahead, roving focus, scroll containment, form association —
 * is Base UI's (ADR 0003). This adds the brand and the Field wiring.
 */
export function Select<T extends string = string>({
  items,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select…',
  size = 'md',
  disabled,
  invalid,
  name,
  id,
  className,
}: SelectProps<T>) {
  const field = useFieldWiring();

  return (
    <BaseSelect.Root
      items={items}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => onValueChange?.(next as T)}
      disabled={disabled}
      name={name}
    >
      <BaseSelect.Trigger
        id={id ?? field?.controlId}
        aria-describedby={field?.describedBy}
        aria-invalid={invalid ?? field?.invalid ? true : undefined}
        className={cn('cb-select', `cb-select--${size}`, className)}
      >
        <BaseSelect.Value placeholder={placeholder} />
        <BaseSelect.Icon className="cb-select__icon">
          <ChevronsUpDown size={16} />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>

      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={6} alignItemWithTrigger={false}>
          <BaseSelect.Popup className="cb-select__popup">
            {items.map((item) => (
              <BaseSelect.Item key={item.value} value={item.value} disabled={item.disabled} className="cb-select__item">
                <span className="cb-select__check">
                  <BaseSelect.ItemIndicator>
                    <Check size={14} />
                  </BaseSelect.ItemIndicator>
                </span>
                <BaseSelect.ItemText>{item.label}</BaseSelect.ItemText>
              </BaseSelect.Item>
            ))}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
