import { describe, expect, it } from 'vitest';
import { scheduleScales } from './schedule.scales.js';

describe('scheduleScales', () => {
  it('uses year and month levels for a monthly overview', () => {
    const scales = scheduleScales({ month: () => 'January', day: () => '5', week: () => 'Week 1' }, 'month');
    expect(scales.map((scale) => scale.unit)).toEqual(['year', 'month']);
  });
  it('uses caller-provided calendar labels on both axis levels', () => {
    const scales = scheduleScales({
      month: (date) => `Bulan ${date.getUTCMonth() + 1}`,
      day: (date) => `Hari ${date.getUTCDate()}`,
      week: (date) => `Pekan ${date.getUTCDate()}`,
    });
    const date = new Date('2026-09-27T00:00:00Z');
    expect(scales.map((scale) => scale.unit)).toEqual(['month', 'day']);
    expect(scales.map((scale) => (typeof scale.format === 'function' ? scale.format(date) : null))).toEqual([
      'Bulan 9',
      'Hari 27',
    ]);
  });

  it('draws weeks on one level so unequal calendar months cannot mislabel their dates', () => {
    const scales = scheduleScales(
      {
        month: () => 'September',
        day: () => '27',
        week: () => 'Pekan 4',
      },
      'week'
    );
    expect(scales.map((scale) => scale.unit)).toEqual(['week']);
    const formatter = scales[0]?.format;
    expect(typeof formatter === 'function' ? formatter(new Date('2026-09-27T00:00:00Z')) : null).toBe('Pekan 4');
  });
});
