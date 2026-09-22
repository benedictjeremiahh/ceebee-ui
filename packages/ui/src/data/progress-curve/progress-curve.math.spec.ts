import { describe, expect, it } from 'vitest';
import { curveRows, readingOn, toPoints } from './progress-curve.math';

/**
 * Only the progress-specific arithmetic is here. Ordering, de-duplication, day validation and the
 * day-by-day alignment moved to `../time-series/time-series.math.spec.ts` when three charts needed
 * them — one copy of that, spec'd once, rather than one per chart drifting apart.
 */
const planned = [
  { day: '2026-09-01', percent: 10 },
  { day: '2026-09-10', percent: 35 },
  { day: '2026-09-20', percent: 70 },
];
const actual = [
  { day: '2026-09-01', percent: 10 },
  { day: '2026-09-12', percent: 30 },
];

describe('toPoints', () => {
  it('renames this Block\u2019s percent to the library\u2019s value, sorted and de-duplicated', () => {
    expect(toPoints([{ day: '2026-09-10', percent: 2 }, { day: '2026-09-01', percent: 1 }]))
      .toEqual([{ day: '2026-09-01', value: 1 }, { day: '2026-09-10', value: 2 }]);
  });
});

describe('readingOn', () => {
  it('reads both series on a day they both report', () => {
    expect(readingOn(planned, actual, '2026-09-01')).toEqual({ plannedPercent: 10, actualPercent: 10, gap: 0 });
  });

  // The whole point of the chart: how far behind, as a number, on a given day.
  it('carries the last report forward — a day nobody reported is not a day of no progress', () => {
    expect(readingOn(planned, actual, '2026-09-15')).toEqual({
      plannedPercent: 35,
      actualPercent: 30,
      gap: -5,
    });
  });

  it('is behind when actual trails planned, and ahead when it leads', () => {
    expect(readingOn(planned, actual, '2026-09-20').gap).toBe(-40);
    expect(readingOn(actual, planned, '2026-09-20').gap).toBe(40);
  });

  it('says nothing rather than zero before either series starts', () => {
    expect(readingOn(planned, actual, '2026-08-01')).toEqual({
      plannedPercent: null,
      actualPercent: null,
      gap: null,
    });
  });

  it('leaves the gap unknown when only one side has reported', () => {
    expect(readingOn(planned, [], '2026-09-10')).toEqual({ plannedPercent: 35, actualPercent: null, gap: null });
  });
});

describe('curveRows', () => {
  // This is the accessible rendering, not a caption — so it is every day either series reports, with
  // both values, because a canvas gives a screen reader nothing else to read.
  it('is one row per day either series reports, with both values and the gap', () => {
    expect(curveRows(planned, actual)).toEqual([
      { day: '2026-09-01', plannedPercent: 10, actualPercent: 10, gap: 0 },
      { day: '2026-09-10', plannedPercent: 35, actualPercent: 10, gap: -25 },
      { day: '2026-09-12', plannedPercent: 35, actualPercent: 30, gap: -5 },
      { day: '2026-09-20', plannedPercent: 70, actualPercent: 30, gap: -40 },
    ]);
  });

  it('is empty when there is nothing to say', () => {
    expect(curveRows([], [])).toEqual([]);
  });
});

