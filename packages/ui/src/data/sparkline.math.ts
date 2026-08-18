/** Sparkline geometry. Pure, because an off-by-one here silently draws a wrong shape. */

export interface SparklineGeometry {
  /** `M…L…` path through every point. Empty when there is nothing to draw. */
  line: string;
  /** The same path closed along the baseline, for the filled variant. */
  area: string;
  points: Array<{ x: number; y: number }>;
}

export function sparklineGeometry(
  values: number[],
  width: number,
  height: number,
  padding = 1,
): SparklineGeometry {
  const usable = values.filter((value) => Number.isFinite(value));
  if (usable.length === 0) return { line: '', area: '', points: [] };

  const min = Math.min(...usable);
  const max = Math.max(...usable);
  const span = max - min;
  const innerHeight = height - padding * 2;
  const step = usable.length > 1 ? width / (usable.length - 1) : 0;

  const points = usable.map((value, index) => ({
    x: usable.length === 1 ? width / 2 : index * step,
    // A flat series sits on the middle line rather than collapsing onto the floor.
    y: padding + (span === 0 ? innerHeight / 2 : innerHeight - ((value - min) / span) * innerHeight),
  }));

  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'}${round(point.x)} ${round(point.y)}`).join(' ');
  const area = `${line} L${round(points[points.length - 1]!.x)} ${height} L${round(points[0]!.x)} ${height} Z`;

  return { line, area, points };
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
