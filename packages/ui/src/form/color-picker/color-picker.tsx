'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Tone } from '../../lib/cn.js';
import { useFieldWiring } from '../field.js';
import { ColorPickerSkeleton } from './color-picker.skeleton.js';

export interface ColorPickerOption {
  tone: Tone;
  label: string;
  disabled?: boolean;
}

export interface ColorPickerProps {
  label: string;
  value?: Tone;
  defaultValue?: Tone;
  onValueChange?: (tone: Tone) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  options?: ColorPickerOption[];
  name?: string;
  disabled?: boolean;
  motion?: boolean;
}

const CORE_OPTIONS: ColorPickerOption[] = [
  { tone: 'neutral', label: 'Neutral' }, { tone: 'brand', label: 'Brand' }, { tone: 'success', label: 'Success' },
  { tone: 'warning', label: 'Warning' }, { tone: 'danger', label: 'Danger' }, { tone: 'info', label: 'Info' },
];

function validateOptions(options: ColorPickerOption[]) {
  if (options.length === 0) throw new RangeError('ColorPicker options must not be empty.');
  const tones = new Set<Tone>();
  options.forEach((option) => {
    if (tones.has(option.tone)) throw new RangeError(`ColorPicker option tones must be unique: ${option.tone}`);
    tones.add(option.tone);
  });
  if (!options.some((option) => !option.disabled)) throw new RangeError('ColorPicker options must include an enabled tone.');
}

function ColorPickerRoot({ label, value, defaultValue = 'brand', onValueChange, open, defaultOpen, onOpenChange, options = CORE_OPTIONS, name, disabled = false, motion = true }: ColorPickerProps) {
  validateOptions(options);
  if (label.trim().length === 0) throw new RangeError('ColorPicker label must not be empty.');
  const field = useFieldWiring();
  const controlledValue = value !== undefined;
  const [internalValue, setInternalValue] = useState<Tone>(defaultValue);
  const selected = controlledValue ? value : internalValue;
  if (!options.some((option) => option.tone === selected && !option.disabled)) throw new RangeError(`ColorPicker value must match an enabled option: ${selected}`);
  const controlledOpen = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const expanded = controlledOpen ? open : internalOpen;
  const effectiveExpanded = disabled ? false : expanded;
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.findIndex((option) => option.tone === selected && !option.disabled)));
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const enabled = useMemo(() => options.map((option, index) => ({ option, index })).filter(({ option }) => !option.disabled), [options]);

  useEffect(() => {
    const selectedIndex = options.findIndex((option) => option.tone === selected && !option.disabled);
    if (selectedIndex >= 0) setActiveIndex(selectedIndex);
  }, [options, selected]);

  useEffect(() => {
    if (disabled && expanded) {
      if (!controlledOpen) setInternalOpen(false);
      onOpenChange?.(false);
    }
  }, [controlledOpen, disabled, expanded, onOpenChange]);

  const changeOpen = (next: boolean) => {
    if (!controlledOpen) setInternalOpen(next);
    onOpenChange?.(next);
  };
  const select = (tone: Tone) => {
    if (disabled) return;
    if (!controlledValue) setInternalValue(tone);
    onValueChange?.(tone);
    changeOpen(false);
  };
  const move = (amount: number) => {
    if (enabled.length === 0) return;
    const current = enabled.findIndex(({ index }) => index === activeIndex);
    const next = enabled[(Math.max(0, current) + amount + enabled.length) % enabled.length]!.index;
    setActiveIndex(next);
    optionRefs.current[next]?.focus();
  };
  const handleGridKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    else if (event.key === 'ArrowDown') { event.preventDefault(); move(3); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); move(-3); }
    else if (event.key === 'Escape') { event.preventDefault(); changeOpen(false); }
  };

  return (
    <BasePopover.Root open={effectiveExpanded} onOpenChange={changeOpen}>
      <span className="cb-color-picker" data-motion={motion ? undefined : 'off'} data-disabled={disabled || undefined}>
        {name ? <input type="hidden" name={name} value={selected} /> : null}
        <BasePopover.Trigger render={<button type="button" />} id={field?.controlId} className="cb-color-picker__trigger" aria-label={label} aria-describedby={field?.describedBy} aria-invalid={field?.invalid || undefined} aria-required={field?.required || undefined} disabled={disabled}>
          <span className="cb-color-picker__swatch" data-tone={selected} aria-hidden="true" />
          <span>{options.find((option) => option.tone === selected)?.label ?? selected}</span>
        </BasePopover.Trigger>
      </span>
      <BasePopover.Portal>
        <BasePopover.Positioner side="bottom" align="start" className="cb-color-picker__positioner">
          <BasePopover.Popup className="cb-color-picker__popup" data-motion={motion ? undefined : 'off'} initialFocus={() => optionRefs.current[activeIndex] ?? false}>
            <div className="cb-color-picker__grid" role="grid" aria-label={`${label} options`} onKeyDown={handleGridKey}>
              {Array.from({ length: Math.ceil(options.length / 3) }, (_, rowIndex) => <div role="row" className="cb-color-picker__row" key={rowIndex}>{options.slice(rowIndex * 3, rowIndex * 3 + 3).map((option, offset) => { const index = rowIndex * 3 + offset; return <button key={option.tone} ref={(node) => { optionRefs.current[index] = node; }} type="button" role="gridcell" className="cb-color-picker__option" data-tone={option.tone} data-selected={selected === option.tone || undefined} tabIndex={index === activeIndex ? 0 : -1} disabled={option.disabled} aria-label={option.label} aria-selected={selected === option.tone} onClick={() => select(option.tone)} onKeyDown={(event) => { if ((event.key === 'Enter' || event.key === ' ') && !option.disabled) { event.preventDefault(); select(option.tone); } }}><span className="cb-color-picker__swatch" data-tone={option.tone} aria-hidden="true" /></button>; })}</div>)}
            </div>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}

export const ColorPicker = Object.assign(ColorPickerRoot, { Skeleton: ColorPickerSkeleton });
