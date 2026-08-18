import { describe, expect, it } from 'vitest';
import { sparklineGeometry } from './sparkline.math.js';

describe('sparklineGeometry', () => {
  it('spans the full width and inverts the y axis, so a rising series rises', () => {
    const { points } = sparklineGeometry([0, 10], 100, 20);
    expect(points[0]!.x).toBe(0);
    expect(points[1]!.x).toBe(100);
    expect(points[0]!.y).toBeGreaterThan(points[1]!.y);
  });

  it('puts a flat series on the middle line rather than collapsing it onto the floor', () => {
    const { points } = sparklineGeometry([5, 5, 5], 100, 20);
    expect(new Set(points.map((point) => point.y)).size).toBe(1);
    expect(points[0]!.y).toBeCloseTo(10, 1);
  });

  it('centres a single point instead of drawing it at the edge', () => {
    const { points } = sparklineGeometry([7], 100, 20);
    expect(points).toHaveLength(1);
    expect(points[0]!.x).toBe(50);
  });

  it('closes the area path back along the baseline', () => {
    const { area } = sparklineGeometry([1, 4, 2], 100, 20);
    expect(area.endsWith('Z')).toBe(true);
    expect(area).toContain('L0 20');
  });

  it('returns nothing to draw for an empty or unusable series', () => {
    expect(sparklineGeometry([], 100, 20).line).toBe('');
    expect(sparklineGeometry([Number.NaN, Number.POSITIVE_INFINITY], 100, 20).points).toEqual([]);
  });
});
