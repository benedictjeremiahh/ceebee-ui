/** The shared horizontal scale every row is drawn on. */
export interface TargetBarsScale {
  min: number;
  max: number;
}

export type TargetVerdict = 'met' | 'missed' | 'unknown';

/**
 * One scale for every row, and it always contains zero. Scaling each row on its own — or starting the
 * axis at the smallest value — makes a 2% margin look like a 20% one, which is the failure this chart
 * exists to avoid. A set with no spread gets a unit span so nothing divides by zero.
 */
export function targetBarsScale(values: readonly (number | null)[]): TargetBarsScale {
  const known = values.filter((value): value is number => value !== null && Number.isFinite(value));
  const min = Math.min(0, ...known);
  const max = Math.max(0, ...known);
  return max === min ? { min, max: min + 1 } : { min, max };
}

/** Where a value sits along the scale, as a percentage of the track's width. */
export function positionOf(value: number, scale: TargetBarsScale): number {
  return ((value - scale.min) / (scale.max - scale.min)) * 100;
}

/** A bar runs from zero to the value, to the left of zero when the value is negative. */
export function barSpan(value: number, scale: TargetBarsScale): { start: number; width: number } {
  const zero = positionOf(0, scale);
  const at = positionOf(value, scale);
  return { start: Math.min(zero, at), width: Math.abs(at - zero) };
}

/** Whether a row met its target. Meeting it exactly counts; a missing figure is unknown, not a miss. */
export function verdictOf(target: number | null, actual: number | null, better: 'higher' | 'lower' = 'higher'): TargetVerdict {
  if (target === null || actual === null) return 'unknown';
  const met = better === 'higher' ? actual >= target : actual <= target;
  return met ? 'met' : 'missed';
}
