import { describe, expect, it } from 'vitest';
import { longestLabel, selectWidth, SELECT_MAX, SELECT_MIN } from './select.math.js';

describe('longestLabel', () => {
  it('finds the longest written label, inside groups too', () => {
    expect(longestLabel([
      { value: 'a', label: 'Gudang' },
      { label: 'Proyek', options: [{ value: 'b', label: 'Lokasi Proyek Barat — Rumah Hartono' }] },
      { value: 'c', label: 42 },
    ])).toBe(35);
  });

  it('falls back to the value when a label is not text, and reads nothing from none', () => {
    expect(longestLabel([{ value: 'plain-value', label: undefined }])).toBe(11);
    expect(longestLabel(undefined)).toBe(0);
  });
});

describe('selectWidth', () => {
  it('grows with the longest option between a floor and a cap', () => {
    expect(selectWidth(10)).toBe(`clamp(${SELECT_MIN}, calc(10ch + 4.5rem), ${SELECT_MAX})`);
  });

  it('keeps the floor when there is nothing to measure', () => {
    expect(selectWidth(0)).toBe(SELECT_MIN);
  });
});
