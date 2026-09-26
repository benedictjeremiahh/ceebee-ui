import { describe, expect, it } from 'vitest';
import { dayToDate, lateRows, lateWeightShare, sameDay, scheduleRows, type ScheduleRow } from './schedule.math.js';
import type { ScheduleItem } from './schedule.types.js';

const item = (over: Partial<ScheduleItem> = {}): ScheduleItem => ({
  id: 'a',
  label: 'Pour the slab',
  start: '2026-01-05',
  end: '2026-01-09',
  ...over,
});

/** The one row a one-item case produced. Throws rather than returning undefined, so a missing row fails loudly. */
const first = (rows: ScheduleRow[]): ScheduleRow => {
  const [row] = rows;
  if (!row) throw new Error('expected a row');
  return row;
};

describe('dayToDate', () => {
  it('reads a day as its UTC midnight', () => {
    expect(dayToDate('2026-01-05')?.toISOString()).toBe('2026-01-05T00:00:00.000Z');
  });

  it('refuses anything that is not a day', () => {
    expect(dayToDate('2026-1-5')).toBeNull();
    expect(dayToDate('05/01/2026')).toBeNull();
    expect(dayToDate('')).toBeNull();
    expect(dayToDate('not a date')).toBeNull();
  });

  it('refuses a day the calendar does not have, rather than rolling it over', () => {
    // new Date('2026-02-30') silently becomes March 2nd; a plan that says February 30th is a bug, not a day.
    expect(dayToDate('2026-02-30')).toBeNull();
  });
});

describe('sameDay', () => {
  it('matches a day read in UTC', () => {
    expect(sameDay(new Date('2026-01-19T00:00:00Z'), '2026-01-19')).toBe(true);
  });

  it('matches a local midnight, so a cell the substrate built from local parts is still found', () => {
    // `new Date(2026, 0, 19)` is midnight on the 19th in whatever zone the reader is in.
    expect(sameDay(new Date(2026, 0, 19), '2026-01-19')).toBe(true);
  });

  it('does not match another day', () => {
    expect(sameDay(new Date('2026-01-20T12:00:00Z'), '2026-01-19')).toBe(false);
  });
});

describe('scheduleRows', () => {
  it('draws an item as a row from its start to its end', () => {
    const row = first(scheduleRows([item()]));
    expect(row.start.toISOString()).toBe('2026-01-05T00:00:00.000Z');
    expect(row.end.toISOString()).toBe('2026-01-09T00:00:00.000Z');
  });

  it('clamps progress to 0–1 and keeps absent progress absent', () => {
    const rows = scheduleRows([item({ id: 'a', progress: 1.4 }), item({ id: 'b', progress: -0.2 }), item({ id: 'c' })]);
    expect(rows.map((r) => r.progress)).toEqual([1, 0, null]);
  });

  it('defaults the weight to all of it and clamps it to 0–10000', () => {
    const rows = scheduleRows([item({ id: 'a' }), item({ id: 'b', weight: 20000 }), item({ id: 'c', weight: -5 })]);
    expect(rows.map((r) => r.weight)).toEqual([10000, 10000, 0]);
  });

  it('draws an item whose end is before its start as a single day', () => {
    const row = first(scheduleRows([item({ start: '2026-01-09', end: '2026-01-05' })]));
    expect(row.start.toISOString()).toBe('2026-01-09T00:00:00.000Z');
    expect(row.end.toISOString()).toBe('2026-01-09T00:00:00.000Z');
  });

  it('drops an item whose dates are not days rather than guessing', () => {
    expect(scheduleRows([item({ start: 'soon' }), item({ id: 'b' })])).toHaveLength(1);
  });

  it('marks an unfinished item late once its end is behind today', () => {
    expect(first(scheduleRows([item({ end: '2026-01-09', progress: 0.4 })], '2026-01-12')).late).toBe(true);
  });

  it('never marks a finished item late, however old', () => {
    expect(first(scheduleRows([item({ end: '2026-01-09', progress: 1 })], '2026-01-12')).late).toBe(false);
  });

  it('is not late on the day it ends, only after it', () => {
    expect(first(scheduleRows([item({ end: '2026-01-09' })], '2026-01-09')).late).toBe(false);
    expect(first(scheduleRows([item({ end: '2026-01-09' })], '2026-01-10')).late).toBe(true);
  });

  it('marks nothing late without a today', () => {
    expect(first(scheduleRows([item({ end: '2020-01-09' })])).late).toBe(false);
  });

  it('draws planned only when no actuals were reported — never a guessed actual', () => {
    const row = first(scheduleRows([item()]));
    expect(row.actual).toBeNull();
    expect(row.planned).toEqual({ left: 0, width: 100 });
    expect(row.overran).toBe(false);
  });

  it('places the actual span inside the planned one by proportion', () => {
    const row = first(
      scheduleRows([item({ start: '2026-01-05', end: '2026-01-10', actual: { start: '2026-01-06', end: '2026-01-08' } })]),
    );
    expect(row.planned).toEqual({ left: 0, width: 100 });
    expect(row.actual).toEqual({ left: 20, width: 40 });
    expect(row.overran).toBe(false);
  });

  it('stretches the row to the union and flags the overrun when actuals run past the plan', () => {
    const row = first(
      scheduleRows([item({ start: '2026-01-05', end: '2026-01-08', actual: { start: '2026-01-06', end: '2026-01-10' } })]),
    );
    expect(row.spanEnd.toISOString()).toBe('2026-01-10T00:00:00.000Z');
    expect(row.planned).toEqual({ left: 0, width: 60 });
    expect(row.actual).toEqual({ left: 20, width: 80 });
    expect(row.overran).toBe(true);
  });

  it('drops actuals that are not days rather than guessing, and keeps the plan', () => {
    const row = first(scheduleRows([item({ actual: { start: 'soon', end: '2026-01-08' } })]));
    expect(row.actual).toBeNull();
    expect(row.planned).toEqual({ left: 0, width: 100 });
  });

  it('draws an actual whose end is before its start as a single day', () => {
    const row = first(
      scheduleRows([item({ start: '2026-01-05', end: '2026-01-09', actual: { start: '2026-01-08', end: '2026-01-06' } })]),
    );
    expect(row.actual?.left).toBeCloseTo(75);
    expect(row.actual?.width).toBeCloseTo(25);
  });
});

describe('lateWeightShare', () => {
  const rows = scheduleRows(
    [
      item({ id: 'a', end: '2026-01-09', weight: 3000 }),
      item({ id: 'b', end: '2026-01-20', weight: 1000 }),
    ],
    '2026-01-12',
  );

  it('counts the late rows and their share of the weight', () => {
    expect(lateRows(rows).map((r) => r.item.id)).toEqual(['a']);
    expect(lateWeightShare(rows)).toBeCloseTo(0.75);
  });

  it('is zero when nothing is late', () => {
    expect(lateWeightShare(scheduleRows([item({ end: '2026-01-20' })], '2026-01-12'))).toBe(0);
  });

  it('is zero rather than infinite when no row carries weight', () => {
    expect(lateWeightShare(scheduleRows([item({ end: '2026-01-09', weight: 0 })], '2026-01-12'))).toBe(0);
  });
});
