/** Donut arithmetic, kept pure so the awkward inputs are asserted (ADR 0012). */

export interface DonutSlice {
  value: number;
  label: string;
}

export interface DonutArc extends DonutSlice {
  /** Fraction of the whole, 0–1. */
  fraction: number;
  /** Stroke dash length for this arc, in circumference units. */
  length: number;
  /** Stroke dash offset that positions it after the arcs before it. */
  offset: number;
  index: number;
}

/**
 * Turns values into arcs. Negative values are dropped rather than drawn backwards, and a set
 * that sums to zero produces no arcs at all instead of dividing by it.
 */
export function donutArcs(slices: DonutSlice[], circumference: number): DonutArc[] {
  const usable = slices.filter((slice) => Number.isFinite(slice.value) && slice.value > 0);
  const total = usable.reduce((sum, slice) => sum + slice.value, 0);
  if (total <= 0) return [];

  let consumed = 0;
  return usable.map((slice, index) => {
    const fraction = slice.value / total;
    const length = fraction * circumference;
    const arc: DonutArc = { ...slice, fraction, length, offset: -consumed, index };
    consumed += length;
    return arc;
  });
}
