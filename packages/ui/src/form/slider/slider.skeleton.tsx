import { Skeleton } from '../../feedback/skeleton.js';
import { cn, type Size } from '../../lib/cn.js';
import type { SliderOrientation } from './slider.js';

export interface SliderSkeletonProps {
  orientation?: SliderOrientation;
  range?: boolean;
  size?: Size;
}

/** Placeholder geometry for a one- or two-thumb Slider (ADR 0009). */
export function SliderSkeleton({ orientation = 'horizontal', range = false, size = 'md' }: SliderSkeletonProps) {
  return (
    <div aria-hidden="true" className={cn('cb-slider', 'cb-slider--skeleton', `cb-slider--${size}`, `cb-slider--${orientation}`, range && 'cb-slider--range')}>
      <div className="cb-slider__control">
        <Skeleton className="cb-slider__track" radius="full" />
        <Skeleton.Circle className="cb-slider__thumb" size="var(--cb-slider-thumb-size)" />
        {range ? <Skeleton.Circle className="cb-slider__thumb" size="var(--cb-slider-thumb-size)" /> : null}
      </div>
    </div>
  );
}
