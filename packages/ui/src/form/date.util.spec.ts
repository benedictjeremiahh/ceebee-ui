import { describe, expect, it } from 'vitest';
import { formatISO, isOutOfRange, isSameDay, monthMatrix, parseDateInput } from './date.util.js';

describe('parseDateInput', () => {
  it('reads ISO and day-first, with any of the common separators', () => {
    expect(formatISO(parseDateInput('2026-08-18'))).toBe('2026-08-18');
    expect(formatISO(parseDateInput('18/08/2026'))).toBe('2026-08-18');
    expect(formatISO(parseDateInput('18-08-2026'))).toBe('2026-08-18');
    expect(formatISO(parseDateInput('18.08.2026'))).toBe('2026-08-18');
  });

  it('expands a two-digit year into this century', () => {
    expect(formatISO(parseDateInput('18/08/26'))).toBe('2026-08-18');
  });

  it('rejects a date that does not exist rather than rolling it into next month', () => {
    expect(parseDateInput('31/02/2026')).toBeNull();
    expect(parseDateInput('2026-02-30')).toBeNull();
    expect(parseDateInput('45/01/2026')).toBeNull();
  });

  it('returns null for what is not a date at all', () => {
    expect(parseDateInput('')).toBeNull();
    expect(parseDateInput('tomorrow')).toBeNull();
    expect(parseDateInput('18/08')).toBeNull();
  });
});

describe('monthMatrix', () => {
  it('always renders six weeks, so the popover never changes height', () => {
    for (const month of [0, 1, 4, 11]) {
      const weeks = monthMatrix(2026, month);
      expect(weeks).toHaveLength(6);
      weeks.forEach((week) => expect(week).toHaveLength(7));
    }
  });

  it('starts the week on Monday by default and on Sunday when asked', () => {
    expect(monthMatrix(2026, 7, 1)[0]![0]!.date.getDay()).toBe(1);
    expect(monthMatrix(2026, 7, 0)[0]![0]!.date.getDay()).toBe(0);
  });

  it('marks the leading and trailing days as outside the month', () => {
    const weeks = monthMatrix(2026, 7, 1);
    const cells = weeks.flat();
    expect(cells.filter((cell) => cell.inMonth)).toHaveLength(31);
    expect(cells.some((cell) => !cell.inMonth)).toBe(true);
  });

  it('carries February 2028 across its leap day', () => {
    const days = monthMatrix(2028, 1).flat().filter((cell) => cell.inMonth);
    expect(days).toHaveLength(29);
  });
});

describe('isSameDay and isOutOfRange', () => {
  it('compares calendar days, not timestamps', () => {
    expect(isSameDay(new Date(2026, 7, 18, 1), new Date(2026, 7, 18, 23))).toBe(true);
    expect(isSameDay(new Date(2026, 7, 18), null)).toBe(false);
  });

  it('treats the bounds themselves as in range', () => {
    const min = new Date(2026, 7, 10);
    const max = new Date(2026, 7, 20);
    expect(isOutOfRange(new Date(2026, 7, 10, 23), min, max)).toBe(false);
    expect(isOutOfRange(new Date(2026, 7, 20, 1), min, max)).toBe(false);
    expect(isOutOfRange(new Date(2026, 7, 9), min, max)).toBe(true);
    expect(isOutOfRange(new Date(2026, 7, 21), min, max)).toBe(true);
  });
});
