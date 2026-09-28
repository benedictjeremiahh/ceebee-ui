export interface CashFlowAnchor { x: number; y: number }
interface Bounds { width: number; height: number }

/** Follow the active period, flipping and clamping against the measured chart bounds. */
export function cashFlowDetailPosition(point: CashFlowAnchor, plot: Bounds, detail: Bounds, gap: number) {
  const x = point.x + gap + detail.width <= plot.width - gap ? point.x + gap : point.x - gap - detail.width;
  const y = point.y + gap + detail.height <= plot.height - gap ? point.y + gap : point.y - gap - detail.height;
  const clamp = (value: number, extent: number, size: number) => Math.max(gap, Math.min(value, extent - size - gap));
  return { left: clamp(x, plot.width, detail.width), top: clamp(y, plot.height, detail.height) };
}
