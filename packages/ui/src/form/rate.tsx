'use client';

import { Star } from 'lucide-react';
import { useId } from 'react';
import { cn } from '../lib/cn.js';
import { useFieldWiring } from './field.js';

export interface RateProps {
  /** 0 means nothing chosen, which is different from choosing the lowest score. */
  value: number;
  onValueChange?: (value: number) => void;
  count?: number;
  size?: number;
  /** Shows a score without offering to change it. */
  readOnly?: boolean;
  /** Names the group when it is not inside a Field. */
  label?: string;
  className?: string;
}

/**
 * A score out of a few, set by pressing one of them.
 *
 * A radiogroup, not a row of buttons: exactly one of a small visible set is the
 * definition of one, and it buys the arrow keys and the announced position for
 * free. Read-only it is not a group at all — there is nothing to choose, so it
 * is an image with a label saying what it shows.
 *
 * Pressing the current score again clears it. Nought stars and one star are
 * different answers, and without this there is no way back to the first.
 */
export function Rate({
  value,
  onValueChange,
  count = 5,
  size = 20,
  readOnly = false,
  label,
  className,
}: RateProps) {
  const group = useId();
  const field = useFieldWiring();
  const scores = Array.from({ length: count }, (_, i) => i + 1);

  if (readOnly) {
    return (
      <span
        className={cn('cb-rate', 'cb-rate--static', className)}
        role="img"
        aria-label={label ? `${label}: ${value}/${count}` : `${value}/${count}`}
      >
        {scores.map((n) => (
          <Star key={n} size={size} strokeWidth={2.5} fill={value >= n ? 'currentColor' : 'none'} />
        ))}
      </span>
    );
  }

  return (
    <span
      className={cn('cb-rate', className)}
      role="radiogroup"
      aria-label={label}
      aria-describedby={field?.describedBy}
    >
      {scores.map((n) => (
        <button
          key={n}
          id={`${group}-${n}`}
          type="button"
          className="cb-rate__star"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n}/${count}`}
          onClick={() => onValueChange?.(value === n ? 0 : n)}
        >
          <Star size={size} strokeWidth={2.5} fill={value >= n ? 'currentColor' : 'none'} />
        </button>
      ))}
    </span>
  );
}
