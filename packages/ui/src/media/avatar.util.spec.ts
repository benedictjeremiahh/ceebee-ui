import { describe, expect, it } from 'vitest';
import { hueForName, initialsOf } from './avatar.util.js';

describe('initialsOf', () => {
  it('takes the first and last word, never more than two letters', () => {
    expect(initialsOf('Sarah Chen')).toBe('SC');
    expect(initialsOf('Benedict Jeremiah Putra')).toBe('BP');
    expect(initialsOf('Prince')).toBe('P');
  });

  it('survives the messy inputs a name field actually receives', () => {
    expect(initialsOf('  ada   lovelace  ')).toBe('AL');
    expect(initialsOf('')).toBe('?');
    expect(initialsOf('   ')).toBe('?');
  });
});

describe('hueForName', () => {
  it('gives the same person the same colour every time', () => {
    expect(hueForName('Sarah Chen')).toBe(hueForName('Sarah Chen'));
  });

  it('spreads different names across the palette', () => {
    const names = ['Sarah Chen', 'Ada Putri', 'Rio Hakim', 'Budi', 'Citra', 'Dewi', 'Eka', 'Fajar'];
    expect(new Set(names.map(hueForName)).size).toBeGreaterThan(1);
  });
});
