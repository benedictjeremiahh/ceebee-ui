import { cn, type Tone } from '../lib/cn.js';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  tone?: Tone;
  /** Accessible name. Omit only when a nearby live region already says what is loading. */
  label?: string;
  className?: string;
}

/** Server-safe: a CSS animation, no state. It stops turning under reduced motion. */
export function Spinner({ size = 'md', tone = 'brand', label, className }: SpinnerProps) {
  return (
    <span
      className={cn('cb-spinner', `cb-spinner--${size}`, className)}
      data-tone={tone}
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}

export interface ProgressBarProps {
  /** Omit for an indeterminate bar — "something is happening, duration unknown". */
  value?: number;
  max?: number;
  tone?: Tone;
  size?: 'sm' | 'md';
  label: string;
  /** Prints the percentage at the end of the track. */
  showValue?: boolean;
  className?: string;
}

export function ProgressBar({ value, max = 100, tone = 'brand', size = 'md', label, showValue, className }: ProgressBarProps) {
  const indeterminate = value === undefined;
  const clamped = indeterminate ? 0 : Math.min(Math.max(value, 0), max);
  const percent = max > 0 ? Math.round((clamped / max) * 100) : 0;

  return (
    <div className={cn('cb-progress', className)} data-tone={tone} data-size={size}>
      <div
        className="cb-progress__track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={indeterminate ? undefined : 0}
        aria-valuemax={indeterminate ? undefined : max}
        aria-valuenow={indeterminate ? undefined : clamped}
      >
        <div
          className="cb-progress__fill"
          data-indeterminate={indeterminate || undefined}
          style={indeterminate ? undefined : { width: `${percent}%` }}
        />
      </div>
      {showValue && !indeterminate ? <span className="cb-progress__value">{percent}%</span> : null}
    </div>
  );
}
