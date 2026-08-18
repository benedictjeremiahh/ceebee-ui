'use client';

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { Check, Minus } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useFieldWiring } from './field.js';

export interface CheckboxProps {
  label: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  value?: string;
  /** Secondary line under the label — the place for "why would I tick this". */
  description?: ReactNode;
  className?: string;
}

/** The control and its label are one component: a checkbox whose label is not wired is a bug. */
export function Checkbox({
  label,
  checked,
  defaultChecked,
  indeterminate,
  onCheckedChange,
  disabled,
  name,
  value,
  description,
  className,
}: CheckboxProps) {
  const generated = useId();
  const field = useFieldWiring();
  const id = field?.controlId ?? generated;
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div className={cn('cb-choice', className)}>
      <BaseCheckbox.Root
        id={id}
        checked={checked}
        defaultChecked={defaultChecked}
        indeterminate={indeterminate}
        onCheckedChange={(next) => onCheckedChange?.(next)}
        disabled={disabled}
        name={name}
        value={value}
        aria-describedby={[descriptionId, field?.describedBy].filter(Boolean).join(' ') || undefined}
        className="cb-checkbox"
      >
        <BaseCheckbox.Indicator className="cb-checkbox__indicator">
          {indeterminate ? <Minus size={12} strokeWidth={3} /> : <Check size={12} strokeWidth={3} />}
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      <div className="cb-choice__text">
        <label htmlFor={id} className="cb-choice__label">
          {label}
        </label>
        {description ? (
          <p className="cb-choice__description" id={descriptionId}>
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export interface RadioOption<T extends string = string> {
  value: T;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps<T extends string = string> {
  options: Array<RadioOption<T>>;
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  name?: string;
  /** Names the group for assistive technology when it is not inside a Field. */
  label?: string;
  direction?: 'column' | 'row';
  disabled?: boolean;
  className?: string;
}

export function RadioGroup<T extends string = string>({
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  label,
  direction = 'column',
  disabled,
  className,
}: RadioGroupProps<T>) {
  const groupId = useId();
  const field = useFieldWiring();

  return (
    <BaseRadioGroup
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => onValueChange?.(next as T)}
      name={name}
      disabled={disabled}
      aria-label={label}
      aria-describedby={field?.describedBy}
      className={cn('cb-radio-group', `cb-radio-group--${direction}`, className)}
    >
      {options.map((option) => {
        const id = `${groupId}-${option.value}`;
        const descriptionId = option.description ? `${id}-description` : undefined;
        return (
          <div className="cb-choice" key={option.value}>
            <BaseRadio.Root
              id={id}
              value={option.value}
              disabled={option.disabled}
              aria-describedby={descriptionId}
              className="cb-radio"
            >
              <BaseRadio.Indicator className="cb-radio__indicator" />
            </BaseRadio.Root>
            <div className="cb-choice__text">
              <label htmlFor={id} className="cb-choice__label">
                {option.label}
              </label>
              {option.description ? (
                <p className="cb-choice__description" id={descriptionId}>
                  {option.description}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </BaseRadioGroup>
  );
}

export interface SwitchProps {
  label: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  description?: ReactNode;
  /** Label on the left, control on the right — the settings-row arrangement. */
  justified?: boolean;
  className?: string;
}

/** A Switch applies immediately. If a change needs saving, that is a Checkbox in a form. */
export function Switch({
  label,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  name,
  description,
  justified = false,
  className,
}: SwitchProps) {
  const generated = useId();
  const field = useFieldWiring();
  const id = field?.controlId ?? generated;
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div className={cn('cb-choice', justified && 'cb-choice--justified', className)}>
      {justified ? null : (
        <BaseSwitch.Root
          id={id}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={(next) => onCheckedChange?.(next)}
          disabled={disabled}
          name={name}
          aria-describedby={[descriptionId, field?.describedBy].filter(Boolean).join(' ') || undefined}
          className="cb-switch"
        >
          <BaseSwitch.Thumb className="cb-switch__thumb" />
        </BaseSwitch.Root>
      )}
      <div className="cb-choice__text">
        <label htmlFor={id} className="cb-choice__label">
          {label}
        </label>
        {description ? (
          <p className="cb-choice__description" id={descriptionId}>
            {description}
          </p>
        ) : null}
      </div>
      {justified ? (
        <BaseSwitch.Root
          id={id}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={(next) => onCheckedChange?.(next)}
          disabled={disabled}
          name={name}
          aria-describedby={[descriptionId, field?.describedBy].filter(Boolean).join(' ') || undefined}
          className="cb-switch"
        >
          <BaseSwitch.Thumb className="cb-switch__thumb" />
        </BaseSwitch.Root>
      ) : null}
    </div>
  );
}
