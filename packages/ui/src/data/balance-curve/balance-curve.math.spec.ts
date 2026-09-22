import { describe, expect, it } from 'vitest';
import { balanceReading } from './balance-curve.math';

/* The shape a real 30-day cash projection has: a dip that lasts a week, then a large receipt. Written
   out because the interesting cases are all about the dip, not the arithmetic. */
const projection = [
  { day: '2026-09-22', value: 40_980_000 },
  { day: '2026-09-23', value: -2_810_000 },
  { day: '2026-09-26', value: -2_810_000 },
  { day: '2026-09-29', value: -2_810_000 },
  { day: '2026-09-30', value: 355_990_000 },
  { day: '2026-10-02', value: 331_890_000 },
];

describe('balanceReading', () => {
  it('finds the low point and the day it happens', () => {
    const reading = balanceReading(projection, 0);
    expect(reading.lowest).toBe(-2_810_000);
    expect(reading.lowestDay).toBe('2026-09-23');
  });

  it('names the first day below the line, and how many days sit there', () => {
    const reading = balanceReading(projection, 0);
    expect(reading.firstBelowDay).toBe('2026-09-23');
    expect(reading.daysBelow).toBe(3);
  });

  it('closes on the last day of the window', () => {
    expect(balanceReading(projection, 0).closing).toBe(331_890_000);
  });

  /* The reason the threshold is a parameter rather than zero: a business holding a minimum buffer is in
     trouble well before it reaches nothing, and a chart drawn against zero says all is well until the
     day it is not. Against a 50 juta buffer the same projection breaches on the first day. */
  it('reads against a buffer, not only against zero', () => {
    const reading = balanceReading(projection, 50_000_000);
    expect(reading.firstBelowDay).toBe('2026-09-22');
    expect(reading.daysBelow).toBe(4);
  });

  // Crying wolf on the one day the business did exactly what it planned would make the warning useless.
  it('treats a balance exactly on the threshold as met, not breached', () => {
    const reading = balanceReading([{ day: '2026-09-22', value: 0 }], 0);
    expect(reading.firstBelowDay).toBeNull();
    expect(reading.daysBelow).toBe(0);
  });

  it('says nothing rather than zero when there is nothing to read', () => {
    expect(balanceReading([], 0)).toEqual({
      lowest: null,
      lowestDay: null,
      firstBelowDay: null,
      daysBelow: 0,
      closing: null,
    });
  });

  it('ignores a day that is not one, rather than letting it become the low point', () => {
    const reading = balanceReading([{ day: '2026-02-30', value: -999_999_999 }, { day: '2026-09-22', value: 10 }], 0);
    expect(reading.lowest).toBe(10);
    expect(reading.daysBelow).toBe(0);
  });
});
