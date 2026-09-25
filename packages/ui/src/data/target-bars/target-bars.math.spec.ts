import { describe, expect, it } from 'vitest';
import { barSpan, deviationOf, deviationScale, positionOf, targetBarsScale, verdictOf } from './target-bars.math.js';

describe('targetBarsScale', () => {
  it('always includes zero, so a bar is measured from nothing rather than from the smallest row', () => {
    expect(targetBarsScale([12, 20, 15])).toEqual({ min: 0, max: 20 });
  });

  it('reaches below zero when a row lost money', () => {
    expect(targetBarsScale([-5, 10, null])).toEqual({ min: -5, max: 10 });
  });

  it('gives an all-zero or empty set a unit span instead of dividing by nothing', () => {
    expect(targetBarsScale([0, 0])).toEqual({ min: 0, max: 1 });
    expect(targetBarsScale([null])).toEqual({ min: 0, max: 1 });
  });
});

describe('positionOf and barSpan', () => {
  const scale = { min: -5, max: 15 };

  it('places a value along the shared scale in percent', () => {
    expect(positionOf(-5, scale)).toBe(0);
    expect(positionOf(0, scale)).toBe(25);
    expect(positionOf(15, scale)).toBe(100);
  });

  it('draws a bar from zero to the value, on whichever side it falls', () => {
    expect(barSpan(10, scale)).toEqual({ start: 25, width: 50 });
    expect(barSpan(-5, scale)).toEqual({ start: 0, width: 25 });
  });
});

describe('verdictOf', () => {
  it('reads higher-is-better by default, and meeting the target counts', () => {
    expect(verdictOf(15, 15)).toBe('met');
    expect(verdictOf(15, 12)).toBe('missed');
  });

  it('flips for a measure where lower is better', () => {
    expect(verdictOf(10, 8, 'lower')).toBe('met');
    expect(verdictOf(10, 12, 'lower')).toBe('missed');
  });

  it('says unknown rather than guessing when either figure is missing', () => {
    expect(verdictOf(null, 12)).toBe('unknown');
    expect(verdictOf(15, null)).toBe('unknown');
  });
});

describe('deviationOf and deviationScale', () => {
  it('measures how far past the target a row landed, positive when that is good', () => {
    expect(deviationOf(15, 18)).toBe(3);
    expect(deviationOf(15, 12)).toBe(-3);
    expect(deviationOf(10, 8, 'lower')).toBe(2);
    expect(deviationOf(null, 8)).toBeNull();
    expect(deviationOf(10, null)).toBeNull();
  });

  it('is symmetric around the target, so a miss and a beat of the same size draw the same length', () => {
    expect(deviationScale([3, -8, null])).toEqual({ min: -8, max: 8 });
    expect(barSpan(-8, deviationScale([3, -8]))).toEqual({ start: 0, width: 50 });
  });

  it('gives a set with no deviation a unit span instead of dividing by nothing', () => {
    expect(deviationScale([0, null])).toEqual({ min: -1, max: 1 });
  });
});
