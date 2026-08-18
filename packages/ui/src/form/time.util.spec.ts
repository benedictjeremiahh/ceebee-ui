import { describe, expect, it } from 'vitest';
import { formatTime, isTimeOutOfRange, parseTime, timeOptions } from './time.util.js';

describe('parseTime', () => {
  it('reads the shapes people actually type', () => {
    expect(parseTime('9')).toEqual({ hours: 9, minutes: 0 });
    expect(parseTime('9:30')).toEqual({ hours: 9, minutes: 30 });
    expect(parseTime('09.30')).toEqual({ hours: 9, minutes: 30 });
    expect(parseTime('0930')).toEqual({ hours: 9, minutes: 30 });
    expect(parseTime('21:05')).toEqual({ hours: 21, minutes: 5 });
  });

  it('handles the 12-hour suffix, including the midnight case that trips everyone', () => {
    expect(parseTime('9pm')).toEqual({ hours: 21, minutes: 0 });
    expect(parseTime('12am')).toEqual({ hours: 0, minutes: 0 });
    expect(parseTime('12pm')).toEqual({ hours: 12, minutes: 0 });
  });

  it('returns null rather than rounding an impossible time into a plausible one', () => {
    expect(parseTime('25:00')).toBeNull();
    expect(parseTime('9:75')).toBeNull();
    expect(parseTime('later')).toBeNull();
    expect(parseTime('')).toBeNull();
  });
});

describe('formatTime', () => {
  it('always pads to hh:mm', () => {
    expect(formatTime({ hours: 9, minutes: 5 })).toBe('09:05');
    expect(formatTime({ hours: 0, minutes: 0 })).toBe('00:00');
  });
});

describe('timeOptions', () => {
  it('walks the whole day at the step', () => {
    expect(timeOptions(60)).toHaveLength(24);
    expect(timeOptions(30)).toHaveLength(48);
  });

  it('stays inside inclusive bounds', () => {
    const options = timeOptions(60, { hours: 8, minutes: 0 }, { hours: 11, minutes: 0 });
    expect(options.map(formatTime)).toEqual(['08:00', '09:00', '10:00', '11:00']);
  });

  it('survives a nonsense step instead of looping forever', () => {
    expect(timeOptions(0).length).toBeGreaterThan(0);
  });
});

describe('isTimeOutOfRange', () => {
  it('treats the bounds themselves as in range', () => {
    const min = { hours: 8, minutes: 0 };
    const max = { hours: 17, minutes: 0 };
    expect(isTimeOutOfRange({ hours: 8, minutes: 0 }, min, max)).toBe(false);
    expect(isTimeOutOfRange({ hours: 17, minutes: 0 }, min, max)).toBe(false);
    expect(isTimeOutOfRange({ hours: 7, minutes: 59 }, min, max)).toBe(true);
    expect(isTimeOutOfRange({ hours: 17, minutes: 1 }, min, max)).toBe(true);
  });
});
