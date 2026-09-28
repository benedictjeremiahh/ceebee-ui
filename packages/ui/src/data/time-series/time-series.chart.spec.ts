import { describe, expect, it } from 'vitest';
import { scaleMarginsFor } from './time-series.chart';

describe('scaleMarginsFor', () => {
  it('does not extend a fixed percentage range past its stated bounds', () => {
    expect(scaleMarginsFor({ min: 0, max: 100 })).toEqual({ top: 0.02, bottom: 0.02 });
  });

  it('keeps breathing room around an unbounded value series', () => {
    expect(scaleMarginsFor(undefined)).toEqual({ top: 0.1, bottom: 0.08 });
  });
});
