'use client';

import { useId, type ReactNode } from 'react';
import { cn, type Tone } from '../../lib/cn.js';
import { WatermarkSkeleton } from './watermark.skeleton.js';

export type WatermarkContent = string | string[];
export type WatermarkDensity = 'sm' | 'md' | 'lg';
export type WatermarkDirection = 'horizontal' | 'vertical';

export interface WatermarkProps {
  /** One mark, or a sequence that repeats in order across the overlay. */
  content: WatermarkContent;
  children: ReactNode;
  tone?: Tone;
  density?: WatermarkDensity;
  direction?: WatermarkDirection;
}

function normalizeContent(content: WatermarkContent): string[] {
  return Array.isArray(content) ? content.filter(Boolean) : [content];
}

export function WatermarkMarks({
  content,
  density = 'md',
  direction = 'horizontal',
}: {
  content: WatermarkContent;
  density?: WatermarkDensity;
  direction?: WatermarkDirection;
}) {
  const marks = normalizeContent(content);
  const values = marks.length > 0 ? marks : [''];
  const id = `cb-watermark-pattern-${useId().replaceAll(':', '')}`;
  const vertical = direction === 'vertical';

  return <svg className="cb-watermark__marks" aria-hidden="true" focusable="false">
    <defs>
      <pattern
        className="cb-watermark__pattern"
        id={id}
        patternUnits="userSpaceOnUse"
        width={vertical ? '0.5em' : '1em'}
        height={vertical ? '1em' : '0.5em'}
      >
        <text className="cb-watermark__mark" x="0" y="0" dy="1em">{values.join(' · ')}</text>
      </pattern>
    </defs>
    <rect className="cb-watermark__fill" width="100%" height="100%" fill={`url(#${id})`} />
  </svg>;
}

/** A presentational overlay that keeps its supplied content's semantics untouched. */
function WatermarkRoot({
  content,
  children,
  tone = 'neutral',
  density = 'md',
  direction = 'horizontal',
}: WatermarkProps) {
  return (
    <div
      className={cn('cb-watermark', `cb-watermark--${density}`, `cb-watermark--${direction}`)}
      data-tone={tone}
    >
      <div className="cb-watermark__content">{children}</div>
      <WatermarkMarks content={content} density={density} direction={direction} />
    </div>
  );
}

export const Watermark = Object.assign(WatermarkRoot, { Skeleton: WatermarkSkeleton });
