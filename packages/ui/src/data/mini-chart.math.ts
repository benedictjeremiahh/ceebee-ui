export interface MiniChartPoint { time: string; value: number }

/** Sparse or invalid values are omitted; the remaining samples keep their original order. */
export function miniChartPoints(values: readonly number[]): MiniChartPoint[] {
  return values.filter(Number.isFinite).map((value, index) => ({
    time: new Date(Date.UTC(2000, 0, index + 1)).toISOString().slice(0, 10),
    value,
  }));
}
