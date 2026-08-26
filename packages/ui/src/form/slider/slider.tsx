'use client';

import { Slider as BaseSlider } from '@base-ui/react/slider';
import { type ReactNode } from 'react';
import { cn, type Size, type Tone } from '../../lib/cn.js';
import { useFieldWiring } from '../field.js';
import { SliderSkeleton } from './slider.skeleton.js';

export type SliderOrientation = 'horizontal' | 'vertical';
export type SliderRangeValue = readonly [number, number];

interface SliderCommonProps {
  /** Names the value control. Range thumbs become “Minimum {label}” and “Maximum {label}”. */
  label: string;
  min?: number;
  max?: number;
  step?: number;
  largeStep?: number;
  minStepsBetweenValues?: number;
  /** Disables visual thumb transitions without changing Slider state feedback. */
  motion?: boolean;
  disabled?: boolean;
  orientation?: SliderOrientation;
  tone?: Tone;
  size?: Size;
  name?: string;
  /** Announces a formatted value without changing the numeric form value. */
  getAriaValueText?: (value: number, index: number) => string;
}

export type SliderProps = SliderCommonProps & (
  | {
      range?: false;
      value?: number;
      defaultValue?: number;
      onValueChange?: (value: number) => void;
      onValueCommitted?: (value: number) => void;
    }
  | {
      range: true;
      value?: SliderRangeValue;
      defaultValue?: SliderRangeValue;
      onValueChange?: (value: SliderRangeValue) => void;
      onValueCommitted?: (value: SliderRangeValue) => void;
    }
);

/**
 * A continuous numeric value, or two bounded values when `range` is true.
 * Base UI owns the hidden range inputs, keyboard map, pointer and touch dragging,
 * thumb collision, and form submission semantics.
 */
function SliderComponent(props: SliderProps) {
  const {
    label,
    min = 0,
    max = 100,
    step = 1,
    largeStep,
    minStepsBetweenValues = 0,
    motion = true,
    disabled = false,
    orientation = 'horizontal',
    tone = 'brand',
    size = 'md',
    name,
    getAriaValueText,
  } = props;
  const field = useFieldWiring();
  const range = props.range === true;
  const value = props.value;
  const defaultValue = props.defaultValue;

  validateSlider({ min, max, step, largeStep, minStepsBetweenValues, value, defaultValue, range });

  const ariaLabel = (index: number) => {
    if (!range) return label;
    return index === 0 ? `Minimum ${label}` : `Maximum ${label}`;
  };
  const ariaValueText = getAriaValueText
    ? (_formattedValue: string, currentValue: number, index: number) => getAriaValueText(currentValue, index)
    : undefined;
  const rootClassName = cn(
    'cb-slider',
    `cb-slider--${size}`,
    `cb-slider--${orientation}`,
    range && 'cb-slider--range',
    !motion && 'cb-slider--motionless',
  );
  const shared = {
    min,
    max,
    step,
    largeStep,
    minStepsBetweenValues,
    disabled,
    orientation,
    name,
    className: rootClassName,
    'data-tone': tone,
    'data-invalid': field?.invalid || undefined,
  };
  const thumbWiring = {
    'aria-describedby': field?.describedBy,
    'aria-invalid': field?.invalid || undefined,
  };
  const thumbInputRef = (first: boolean) => (input: HTMLInputElement | null) => {
    if (!input) return;
    if (first && field) input.id = field.controlId;
    if (field?.describedBy) input.setAttribute('aria-describedby', field.describedBy);
    else input.removeAttribute('aria-describedby');
    if (field?.invalid) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  };

  if (range) {
    const rangeDefaultValue = defaultValue ?? ([min, max] as SliderRangeValue);
    return (
      <BaseSlider.Root
        key="range"
        {...shared}
        value={value as SliderRangeValue | undefined}
        defaultValue={rangeDefaultValue as SliderRangeValue}
        onValueChange={(next) => props.onValueChange?.(next as SliderRangeValue)}
        onValueCommitted={(next) => props.onValueCommitted?.(next as SliderRangeValue)}
      >
        <SliderTrack />
        <BaseSlider.Thumb index={0} className="cb-slider__thumb" inputRef={thumbInputRef(true)} getAriaLabel={ariaLabel} getAriaValueText={ariaValueText} {...thumbWiring} />
        <BaseSlider.Thumb index={1} className="cb-slider__thumb" inputRef={thumbInputRef(false)} getAriaLabel={ariaLabel} getAriaValueText={ariaValueText} {...thumbWiring} />
      </BaseSlider.Root>
    );
  }

  return (
    <BaseSlider.Root
      key="single"
      {...shared}
      value={value as number | undefined}
      defaultValue={defaultValue as number | undefined}
      onValueChange={(next) => props.onValueChange?.(next as number)}
      onValueCommitted={(next) => props.onValueCommitted?.(next as number)}
    >
      <SliderTrack />
      <BaseSlider.Thumb className="cb-slider__thumb" inputRef={thumbInputRef(true)} getAriaLabel={ariaLabel} getAriaValueText={ariaValueText} {...thumbWiring} />
    </BaseSlider.Root>
  );
}

function SliderTrack() {
  return (
    <BaseSlider.Control className="cb-slider__control">
      <BaseSlider.Track className="cb-slider__track">
        <BaseSlider.Indicator className="cb-slider__indicator" />
      </BaseSlider.Track>
    </BaseSlider.Control>
  );
}

function validateSlider({
  min,
  max,
  step,
  largeStep,
  minStepsBetweenValues,
  value,
  defaultValue,
  range,
}: {
  min: number;
  max: number;
  step: number;
  largeStep: number | undefined;
  minStepsBetweenValues: number;
  value: number | SliderRangeValue | undefined;
  defaultValue: number | SliderRangeValue | undefined;
  range: boolean;
}) {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max) {
    throw new RangeError('Slider requires finite min and max values where min is less than max.');
  }
  if (!Number.isFinite(step) || step <= 0) {
    throw new RangeError('Slider step must be a finite number greater than zero.');
  }
  if (largeStep !== undefined && (!Number.isFinite(largeStep) || largeStep <= 0)) {
    throw new RangeError('Slider largeStep must be a finite number greater than zero.');
  }
  if (!Number.isInteger(minStepsBetweenValues) || minStepsBetweenValues < 0) {
    throw new RangeError('Slider minStepsBetweenValues must be a non-negative integer.');
  }
  if (range && step * minStepsBetweenValues > max - min) {
    throw new RangeError('Slider minStepsBetweenValues cannot fit within min and max.');
  }

  const candidate = value ?? defaultValue;
  if (candidate === undefined) return;
  if (range) {
    if (!Array.isArray(candidate) || candidate.length !== 2) {
      throw new RangeError('A range Slider requires exactly two values.');
    }
    validateValue(candidate[0], min, max, step);
    validateValue(candidate[1], min, max, step);
    if (candidate[0] > candidate[1]) {
      throw new RangeError('A range Slider requires values in ascending order.');
    }
    if (candidate[1] - candidate[0] < step * minStepsBetweenValues) {
      throw new RangeError('Range Slider values do not satisfy minStepsBetweenValues.');
    }
    return;
  }
  if (typeof candidate !== 'number') {
    throw new RangeError('A single-value Slider requires one number.');
  }
  validateValue(candidate, min, max, step);
}

function validateValue(value: number, min: number, max: number, step: number) {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new RangeError('Slider values must be finite and within min and max.');
  }
  if (!isStepAligned(value, min, step)) {
    throw new RangeError('Slider values must align to step increments from min.');
  }
}

function isStepAligned(value: number, min: number, step: number) {
  const steps = (value - min) / step;
  return Math.abs(steps - Math.round(steps)) <= Number.EPSILON * Math.max(1, Math.abs(steps)) * 32;
}

export const Slider = Object.assign(SliderComponent, { Skeleton: SliderSkeleton });
