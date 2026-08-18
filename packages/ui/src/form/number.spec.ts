import { describe, expect, it } from 'vitest';
import { canStep, clamp, decimalPlaces, parseNumber, stepBy } from './number.js';

describe('parseNumber', () => {
  it('reads plain and comma-decimal input', () => {
    expect(parseNumber('12')).toBe(12);
    expect(parseNumber('12,5')).toBe(12.5);
    expect(parseNumber(' -3.25 ')).toBe(-3.25);
  });

  it('returns null for the half-typed states rather than guessing', () => {
    expect(parseNumber('')).toBeNull();
    expect(parseNumber('-')).toBeNull();
    expect(parseNumber('.')).toBeNull();
    expect(parseNumber('abc')).toBeNull();
  });
});

describe('clamp', () => {
  it('holds the value inside its bounds', () => {
    expect(clamp(12, { min: 0, max: 10 })).toBe(10);
    expect(clamp(-4, { min: 0, max: 10 })).toBe(0);
    expect(clamp(5, {})).toBe(5);
  });
});

describe('stepBy', () => {
  it('steps and clamps', () => {
    expect(stepBy(4, 1, { step: 1, max: 5 })).toBe(5);
    expect(stepBy(5, 1, { step: 1, max: 5 })).toBe(5);
    expect(stepBy(1, -1, { step: 1, min: 0 })).toBe(0);
  });

  it('does not leak floating point into what a person reads', () => {
    expect(stepBy(0.1, 1, { step: 0.2 })).toBe(0.3);
    expect(stepBy(0.3, -1, { step: 0.1 })).toBe(0.2);
  });

  it('starts from the minimum when the field is empty', () => {
    expect(stepBy(null, 1, { step: 5, min: 10 })).toBe(15);
    expect(stepBy(null, 1, { step: 1 })).toBe(1);
  });

  it('reports the precision the step implies', () => {
    expect(decimalPlaces(1)).toBe(0);
    expect(decimalPlaces(0.25)).toBe(2);
  });
});

describe('canStep', () => {
  it('closes off the direction that would do nothing', () => {
    expect(canStep(10, 1, { max: 10 })).toBe(false);
    expect(canStep(10, -1, { max: 10 })).toBe(true);
    expect(canStep(0, -1, { min: 0 })).toBe(false);
    expect(canStep(null, 1, { max: 10 })).toBe(true);
  });
});
