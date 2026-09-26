import { describe, expect, it } from 'vitest';
import { landingCell } from './diagram.palette.js';

describe('landingCell', () => {
  it('centres a stage on the point, in whole cells', () => {
    // 20px cells: a point at (200, 100) is cell (10, 5); an 8×3 stage centred there starts at (6, 3.5) → (6, 4).
    expect(landingCell({ x: 200, y: 100 }, 20, 'rect')).toEqual({ x: 6, y: 4 });
  });

  it('centres a diamond by its own 4×4 slot', () => {
    expect(landingCell({ x: 200, y: 100 }, 20, 'diamond')).toEqual({ x: 8, y: 3 });
  });

  it('lands left of or above the origin when dropped there', () => {
    expect(landingCell({ x: 0, y: 0 }, 20, 'pill')).toEqual({ x: -4, y: -1 });
  });
});
