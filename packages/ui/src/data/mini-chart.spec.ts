import { describe, expect, it } from 'vitest';
import { miniChartPoints } from './mini-chart.math.js';

describe('miniChartPoints', () => {
  it('keeps finite values in order on an ordinal substrate scale', () => {
    const points = miniChartPoints([2, Number.NaN, 0, Number.POSITIVE_INFINITY, -4]);
    expect(points.map((point) => point.value)).toEqual([2, 0, -4]);
    expect(new Set(points.map((point) => point.time)).size).toBe(3);
  });

  it('defines empty, flat, and one-point data without inventing chart geometry', () => {
    expect(miniChartPoints([])).toEqual([]);
    expect(miniChartPoints([5])).toHaveLength(1);
    expect(miniChartPoints([5, 5, 5]).map((point) => point.value)).toEqual([5, 5, 5]);
  });
});
