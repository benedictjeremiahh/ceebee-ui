/** Numeric input arithmetic, kept pure so the awkward cases are asserted, not hoped for. */

export interface NumberBounds {
  min?: number;
  max?: number;
  step?: number;
}

/** Parses what a person typed. Accepts a comma decimal separator; returns null for nonsense. */
export function parseNumber(input: string): number | null {
  const trimmed = input.trim().replace(/\s/g, '').replace(',', '.');
  if (trimmed === '' || trimmed === '-' || trimmed === '.') return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export function clamp(value: number, { min, max }: NumberBounds): number {
  let next = value;
  if (typeof min === 'number') next = Math.max(next, min);
  if (typeof max === 'number') next = Math.min(next, max);
  return next;
}

/**
 * Steps by `step` and clamps. Floating point is rounded back to the step's own precision,
 * because 0.1 + 0.2 must read as 0.3 in an input a person is looking at.
 */
export function stepBy(value: number | null, direction: 1 | -1, bounds: NumberBounds): number {
  const step = bounds.step ?? 1;
  const base = value ?? bounds.min ?? 0;
  const next = base + direction * step;
  const decimals = decimalPlaces(step);
  const rounded = Number(next.toFixed(decimals));
  return clamp(rounded, bounds);
}

export function decimalPlaces(step: number): number {
  const text = String(step);
  const dot = text.indexOf('.');
  return dot === -1 ? 0 : text.length - dot - 1;
}

/** Whether stepping in this direction would do anything — drives the disabled state. */
export function canStep(value: number | null, direction: 1 | -1, bounds: NumberBounds): boolean {
  if (value === null) return true;
  if (direction === 1) return typeof bounds.max !== 'number' || value < bounds.max;
  return typeof bounds.min !== 'number' || value > bounds.min;
}
