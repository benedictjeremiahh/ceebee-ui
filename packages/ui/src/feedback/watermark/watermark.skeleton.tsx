'use client';

import { Skeleton } from '../skeleton.js';
import { cn, type Tone } from '../../lib/cn.js';
import {
  type WatermarkContent,
  type WatermarkDensity,
  type WatermarkDirection,
  WatermarkMarks,
} from './watermark.js';

export interface WatermarkSkeletonProps {
  content?: WatermarkContent;
  tone?: Tone;
  density?: WatermarkDensity;
  direction?: WatermarkDirection;
  lines?: number;
}

/** Matching marked content surface while the wrapped content is loading (ADR 0009). */
export function WatermarkSkeleton({
  content = 'Loading',
  tone = 'neutral',
  density = 'md',
  direction = 'horizontal',
  lines = 3,
}: WatermarkSkeletonProps) {
  return (
    <div
      className={cn(
        'cb-watermark',
        'cb-watermark--skeleton',
        `cb-watermark--${density}`,
        `cb-watermark--${direction}`,
      )}
      data-tone={tone}
      aria-hidden="true"
    >
      <div className="cb-watermark__content">
        <Skeleton.Text lines={lines} />
      </div>
      <WatermarkMarks content={content} density={density} direction={direction} />
    </div>
  );
}
