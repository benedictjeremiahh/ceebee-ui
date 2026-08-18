import { describe, expect, it } from 'vitest';
import { donutArcs } from './donut.math.js';

const CIRCUMFERENCE = 100;

describe('donutArcs', () => {
  it('splits the circle in proportion and leaves no gap between arcs', () => {
    const arcs = donutArcs(
      [
        { value: 1, label: 'a' },
        { value: 3, label: 'b' },
      ],
      CIRCUMFERENCE,
    );
    expect(arcs.map((arc) => arc.length)).toEqual([25, 75]);
    expect(arcs[1]!.offset).toBe(-25);
    expect(arcs.reduce((sum, arc) => sum + arc.length, 0)).toBe(CIRCUMFERENCE);
  });

  it('drops values that cannot be drawn rather than drawing them backwards', () => {
    const arcs = donutArcs(
      [
        { value: 5, label: 'a' },
        { value: -5, label: 'b' },
        { value: Number.NaN, label: 'c' },
        { value: 0, label: 'd' },
      ],
      CIRCUMFERENCE,
    );
    expect(arcs).toHaveLength(1);
    expect(arcs[0]!.length).toBe(CIRCUMFERENCE);
  });

  it('draws nothing when everything is zero instead of dividing by it', () => {
    expect(donutArcs([{ value: 0, label: 'a' }], CIRCUMFERENCE)).toEqual([]);
    expect(donutArcs([], CIRCUMFERENCE)).toEqual([]);
  });
});
