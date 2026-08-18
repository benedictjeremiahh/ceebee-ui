import type { CSSProperties, ReactNode } from 'react';
import { cn, type DecorHue, type Tone } from '../lib/cn.js';
import { ringGeometry } from './progress-ring.math.js';

export interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  thickness?: number;
  tone?: Tone;
  hue?: DecorHue;
  /** Content in the middle of the ring. Defaults to the rounded percentage. */
  children?: ReactNode;
  /** Accessible name; required because a bare percentage tells a screen reader nothing. */
  label: string;
  className?: string;
}

/**
 * The 84%-style ring the reference board leans on. Hand-written SVG, no charting
 * dependency — it has no axis and no scale, so it is a Widget, not a Chart (ADR 0007).
 */
export function ProgressRing({
  value,
  max = 100,
  size = 96,
  thickness = 10,
  tone = 'brand',
  hue,
  children,
  label,
  className,
}: ProgressRingProps) {
  const { radius, circumference, dashOffset, clamped } = ringGeometry(value, max, size, thickness);
  const center = size / 2;
  const style = {
    '--cb-ring-size': `${size}px`,
    '--cb-ring-circumference': `${circumference}`,
    '--cb-ring-offset': `${dashOffset}`,
  } as CSSProperties;

  return (
    <div
      className={cn('cb-ring', className)}
      style={style}
      data-tone={tone}
      data-hue={hue}
      role="img"
      aria-label={`${label}: ${Math.round((clamped / (max || 1)) * 100)}%`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle className="cb-ring__track" cx={center} cy={center} r={radius} strokeWidth={thickness} fill="none" />
        <circle
          className="cb-ring__value"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <div className="cb-ring__center">{children ?? `${Math.round((clamped / (max || 1)) * 100)}%`}</div>
    </div>
  );
}
