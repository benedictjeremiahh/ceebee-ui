import { describe, expect, it } from 'vitest';
import { asDay, curveRows, curveSeries, curveSpan, nearestDay, orderedPoints, readingOn, round1 } from './progress-curve.math';

const planned = [
  { day: '2026-09-01', percent: 10 },
  { day: '2026-09-10', percent: 35 },
  { day: '2026-09-20', percent: 70 },
];
const actual = [
  { day: '2026-09-01', percent: 10 },
  { day: '2026-09-12', percent: 30 },
];

describe('asDay', () => {
  it('takes a calendar day', () => {
    expect(asDay('2026-09-21')).toBe('2026-09-21');
  });

  // The pattern is not the test: 2026-02-30 matches it and is not a day.
  it('refuses a date that does not exist', () => {
    expect(asDay('2026-02-30')).toBeNull();
    expect(asDay('2026-13-01')).toBeNull();
  });

  it('refuses an instant, a blank and nonsense', () => {
    expect(asDay('2026-09-21T00:00:00Z')).toBeNull();
    expect(asDay('')).toBeNull();
    expect(asDay('kemarin')).toBeNull();
  });
});

describe('orderedPoints', () => {
  it('sorts by day', () => {
    expect(orderedPoints([{ day: '2026-09-10', percent: 2 }, { day: '2026-09-01', percent: 1 }]).map((p) => p.day))
      .toEqual(['2026-09-01', '2026-09-10']);
  });

  // One bad row should not bend the line, and should not take the rest of the chart with it.
  it('drops what is not a day rather than failing', () => {
    expect(orderedPoints([{ day: 'besok', percent: 5 }, { day: '2026-09-01', percent: 1 }]).map((p) => p.day))
      .toEqual(['2026-09-01']);
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

describe('curveSpan', () => {
  it('covers both series', () => {
    expect(curveSpan(planned, actual)).toEqual({ from: '2026-09-01', to: '2026-09-20' });
  });

  it('is nothing to draw when there are no points', () => {
    expect(curveSpan([], [])).toBeNull();
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

describe('round1', () => {
  it('keeps one decimal, because four is false precision on an estimate', () => {
    expect(round1(13.4999)).toBe(13.5);
    expect(round1(-5.04)).toBe(-5);
  });
});

describe('curveSeries', () => {
  // The substrate throws on a repeated or unsorted time, so this is a crash guard, not tidying.
  it('keeps one point per day, taking the later value as the correction it is', () => {
    expect(curveSeries([
      { day: '2026-09-10', percent: 30 },
      { day: '2026-09-01', percent: 10 },
      { day: '2026-09-10', percent: 34 },
    ])).toEqual([
      { day: '2026-09-01', percent: 10 },
      { day: '2026-09-10', percent: 34 },
    ]);
  });

  it('drops what is not a day', () => {
    expect(curveSeries([{ day: '2026-02-30', percent: 5 }])).toEqual([]);
  });
});

describe('nearestDay', () => {
  it('finds the reported day closest to the one asked for', () => {
    expect(nearestDay(['2026-09-01', '2026-09-10', '2026-09-20'], '2026-09-12')).toBe('2026-09-10');
  });

  it('takes the earlier day when two are equally close, rather than inventing a tiebreak', () => {
    expect(nearestDay(['2026-09-10', '2026-09-20'], '2026-09-15')).toBe('2026-09-10');
  });

  it('is nothing when nothing was reported, or when the day asked for is not one', () => {
    expect(nearestDay([], '2026-09-12')).toBeNull();
    expect(nearestDay(['2026-09-10'], 'hari ini')).toBeNull();
  });
});
