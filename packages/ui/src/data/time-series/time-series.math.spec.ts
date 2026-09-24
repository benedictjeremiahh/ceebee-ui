import { describe, expect, it } from 'vitest';
import { alignRows, asDay, nearestDay, niceRange, readableDay, round1, seriesPoints, seriesSpan, valueOn } from './time-series.math';

const planned = [
  { day: '2026-09-01', value: 10 },
  { day: '2026-09-10', value: 35 },
  { day: '2026-09-20', value: 70 },
];
const actual = [
  { day: '2026-09-01', value: 10 },
  { day: '2026-09-12', value: 30 },
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

describe('seriesPoints', () => {
  it('sorts by day', () => {
    expect(seriesPoints([{ day: '2026-09-10', value: 2 }, { day: '2026-09-01', value: 1 }]).map((p) => p.day))
      .toEqual(['2026-09-01', '2026-09-10']);
  });

  // The substrate throws on a repeated or unsorted time, so this is a crash guard, not tidying.
  it('keeps one point per day, taking the later value as the correction it is', () => {
    expect(seriesPoints([
      { day: '2026-09-10', value: 30 },
      { day: '2026-09-10', value: 34 },
    ])).toEqual([{ day: '2026-09-10', value: 34 }]);
  });

  it('drops what is not a day rather than failing', () => {
    expect(seriesPoints([{ day: 'besok', value: 5 }, { day: '2026-09-01', value: 1 }]).map((p) => p.day))
      .toEqual(['2026-09-01']);
  });
});

describe('valueOn', () => {
  it('carries the last reading forward', () => {
    expect(valueOn(planned, '2026-09-15')).toBe(35);
  });

  it('says nothing rather than zero before the series starts', () => {
    expect(valueOn(planned, '2026-08-01')).toBeNull();
  });
});

describe('alignRows', () => {
  // This is the accessible rendering, not a caption — every day any series reports, with every value.
  it('is one row per day any series reports, with each series value carried forward', () => {
    expect(alignRows([{ key: 'planned', points: planned }, { key: 'actual', points: actual }])).toEqual([
      { day: '2026-09-01', values: { planned: 10, actual: 10 } },
      { day: '2026-09-10', values: { planned: 35, actual: 10 } },
      { day: '2026-09-12', values: { planned: 35, actual: 30 } },
      { day: '2026-09-20', values: { planned: 70, actual: 30 } },
    ]);
  });

  it('is empty when there is nothing to say', () => {
    expect(alignRows([{ key: 'a', points: [] }])).toEqual([]);
  });

  it('holds a key for every series, even one that never reported', () => {
    expect(alignRows([{ key: 'a', points: planned }, { key: 'b', points: [] }]).at(0)?.values)
      .toEqual({ a: 10, b: null });
  });
});

describe('seriesSpan', () => {
  it('covers every series', () => {
    expect(seriesSpan([{ points: planned }, { points: actual }])).toEqual({ from: '2026-09-01', to: '2026-09-20' });
  });

  it('is nothing to draw when there are no points', () => {
    expect(seriesSpan([{ points: [] }])).toBeNull();
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

describe('round1', () => {
  it('keeps one decimal, because four is false precision on an estimate', () => {
    expect(round1(13.4999)).toBe(13.5);
    expect(round1(-5.04)).toBe(-5);
  });
});

describe('readableDay', () => {
  it('writes a calendar day for people, in the locale it is handed', () => {
    expect(readableDay('2026-09-24', 'id-ID')).toBe('24 Sep 2026');
    expect(readableDay('2026-09-24', 'en-GB')).toBe('24 Sept 2026');
  });

  it('drops the year where an axis has no room for it', () => {
    expect(readableDay('2026-09-24', 'id-ID', 'short')).toBe('24 Sep');
  });

  it('never shifts a day across midnight — a calendar day has no time zone', () => {
    expect(readableDay('2026-01-01', 'id-ID')).toBe('1 Jan 2026');
  });

  it('leaves anything that is not a day as it came', () => {
    expect(readableDay('soon', 'id-ID')).toBe('soon');
    expect(readableDay('2026-02-30', 'id-ID')).toBe('2026-02-30');
  });
});

describe('niceRange', () => {
  it('rounds outwards to a tick of 1, 2 or 5 times a power of ten', () => {
    expect(niceRange(0, 97)).toEqual({ min: 0, max: 100, step: 20 });
    expect(niceRange(0, 100)).toEqual({ min: 0, max: 100, step: 20 });
    expect(niceRange(0, 0.9)).toEqual({ min: 0, max: 1, step: 0.2 });
  });

  it('keeps every reading inside the range it returns — the top is never clipped', () => {
    const rounded = niceRange(-50, 80);
    expect(rounded.min).toBeLessThanOrEqual(-50);
    expect(rounded.max).toBeGreaterThanOrEqual(80);
  });

  it('answers a flat series rather than dividing by zero', () => {
    expect(niceRange(3, 3)).toEqual({ min: 3, max: 3, step: 1 });
    expect(niceRange(0, Number.POSITIVE_INFINITY)).toEqual({ min: 0, max: Number.POSITIVE_INFINITY, step: 1 });
  });
});
