import { describe, expect, it } from 'vitest';
import { shouldAutoplay, type AutoplayConditions } from './autoplay.js';

const running: AutoplayConditions = {
  requested: true,
  pointerInside: false,
  focusInside: false,
  documentHidden: false,
  reducedMotion: false,
};

describe('shouldAutoplay', () => {
  it('advances when nothing objects', () => {
    expect(shouldAutoplay(running)).toBe(true);
  });

  it('stays still when autoplay was never asked for', () => {
    expect(shouldAutoplay({ ...running, requested: false })).toBe(false);
  });

  it('stops under the pointer, so a slide cannot move out from under a click', () => {
    expect(shouldAutoplay({ ...running, pointerInside: true })).toBe(false);
  });

  it('stops while focus is inside, so a keyboard user does not lose their place', () => {
    expect(shouldAutoplay({ ...running, focusInside: true })).toBe(false);
  });

  it('stops in a background tab', () => {
    expect(shouldAutoplay({ ...running, documentHidden: true })).toBe(false);
  });

  it('never autoplays under reduced motion', () => {
    expect(shouldAutoplay({ ...running, reducedMotion: true })).toBe(false);
  });
});
