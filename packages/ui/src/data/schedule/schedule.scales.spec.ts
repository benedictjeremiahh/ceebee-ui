import { describe, expect, it } from 'vitest';
import { scheduleScales } from './schedule.scales.js';

describe('scheduleScales', () => {
  it('uses caller-provided calendar labels on both axis levels', () => {
    const scales = scheduleScales({
      month: (date) => `Bulan ${date.getUTCMonth() + 1}`,
      day: (date) => `Hari ${date.getUTCDate()}`,
      week: (date) => `Pekan ${date.getUTCDate()}`,
    });
    const date = new Date('2026-09-27T00:00:00Z');
    expect(scales.map((scale) => scale.unit)).toEqual(['month', 'day']);
    expect(scales.map((scale) => typeof scale.format === 'function' ? scale.format(date) : null))
      .toEqual(['Bulan 9', 'Hari 27']);
  });

  it('can draw week cells for a longer schedule without forcing a day-by-day scroll', () => {
    const scales = scheduleScales({
      month: () => 'September',
      day: () => '27',
      week: () => 'Pekan 4',
    }, 'week');
    expect(scales.map((scale) => scale.unit)).toEqual(['month', 'week']);
    const formatter = scales[1]?.format;
    expect(typeof formatter === 'function' ? formatter(new Date('2026-09-27T00:00:00Z')) : null).toBe('Pekan 4');
  });
});
