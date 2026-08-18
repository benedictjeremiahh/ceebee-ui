'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn, type Size } from '../lib/cn.js';
import { useFieldWiring } from './field.js';

export interface ComboboxOption {
  value: string;
  label: string;
  description?: ReactNode;
}

export interface ComboboxProps {
  items: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  /** Shown when the query matches nothing. */
  emptyMessage?: ReactNode;
  size?: Size;
  disabled?: boolean;
  invalid?: boolean;
  name?: string;
  className?: string;
}

/**
 * A Select you can type into. Reach for it past roughly a dozen options — below that, scanning a
 * list is faster than typing, and Select is the simpler component.
 */
export function Combobox({
  items,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Search…',
  emptyMessage = 'Nothing matched',
  size = 'md',
  disabled,
  invalid,
  name,
  className,
}: ComboboxProps) {
  const field = useFieldWiring();

  return (
    <BaseCombobox.Root
      items={items}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => onValueChange?.((next as string | null) ?? null)}
      itemToStringLabel={(item: ComboboxOption | string) => (typeof item === 'string' ? item : item.label)}
      disabled={disabled}
      name={name}
    >
      <div className={cn('cb-combobox', `cb-combobox--${size}`, className)} data-disabled={disabled || undefined}>
        <BaseCombobox.Input
          className="cb-combobox__input"
          placeholder={placeholder}
          id={field?.controlId}
          aria-describedby={field?.describedBy}
          aria-invalid={invalid ?? field?.invalid ? true : undefined}
        />
        <BaseCombobox.Clear className="cb-combobox__clear" aria-label="Clear">
          <X size={14} />
        </BaseCombobox.Clear>
        <BaseCombobox.Trigger className="cb-combobox__trigger" aria-label="Open">
          <ChevronsUpDown size={16} />
        </BaseCombobox.Trigger>
      </div>

      <BaseCombobox.Portal>
        <BaseCombobox.Positioner sideOffset={6}>
          <BaseCombobox.Popup className="cb-combobox__popup">
            <BaseCombobox.Empty className="cb-combobox__empty">{emptyMessage}</BaseCombobox.Empty>
            <BaseCombobox.List>
              {(item: ComboboxOption) => (
                <BaseCombobox.Item key={item.value} value={item} className="cb-combobox__item">
                  <span className="cb-combobox__check">
                    <BaseCombobox.ItemIndicator>
                      <Check size={14} />
                    </BaseCombobox.ItemIndicator>
                  </span>
                  <span className="cb-combobox__text">
                    <span className="cb-combobox__label">{item.label}</span>
                    {item.description ? <span className="cb-combobox__description">{item.description}</span> : null}
                  </span>
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  );
}
