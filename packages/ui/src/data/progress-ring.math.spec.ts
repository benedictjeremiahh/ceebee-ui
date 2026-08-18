import { describe, expect, it } from 'vitest';
import { ringGeometry } from './progress-ring.math.js';

describe('ringGeometry', () => {
  it('leaves no arc drawn at zero and closes the ring at max', () => {
    const empty = ringGeometry(0, 100, 96, 10);
    const full = ringGeometry(100, 100, 96, 10);
    expect(empty.dashOffset).toBeCloseTo(empty.circumference);
    expect(full.dashOffset).toBeCloseTo(0);
  });

  it('draws half the circumference at half of max', () => {
    const { circumference, dashOffset } = ringGeometry(50, 100, 96, 10);
    expect(dashOffset).toBeCloseTo(circumference / 2);
  });

  it('insets the radius by half the stroke so the ring is not clipped by the viewbox', () => {
    expect(ringGeometry(50, 100, 96, 10).radius).toBe(43);
  });

  it('clamps out-of-range and non-finite values instead of drawing an impossible arc', () => {
    expect(ringGeometry(140, 100, 96, 10).clamped).toBe(100);
    expect(ringGeometry(-20, 100, 96, 10).clamped).toBe(0);
    expect(ringGeometry(Number.NaN, 100, 96, 10).clamped).toBe(0);
  });

  it('survives a zero max rather than dividing by it', () => {
    const geometry = ringGeometry(5, 0, 96, 10);
    expect(Number.isFinite(geometry.dashOffset)).toBe(true);
  });
});
