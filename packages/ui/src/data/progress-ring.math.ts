/** The ring's geometry, kept out of the component so it can be asserted (ADR 0012). */
export interface RingGeometry {
  radius: number;
  circumference: number;
  /** Stroke offset that renders `value` of `max` as a filled arc. */
  dashOffset: number;
  /** Value clamped into range, for the accessible label and the printed number. */
  clamped: number;
}

export function ringGeometry(value: number, max: number, size: number, thickness: number): RingGeometry {
  const safeMax = max > 0 ? max : 1;
  const clamped = Math.min(Math.max(Number.isFinite(value) ? value : 0, 0), safeMax);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped / safeMax);
  return { radius, circumference, dashOffset, clamped };
}
