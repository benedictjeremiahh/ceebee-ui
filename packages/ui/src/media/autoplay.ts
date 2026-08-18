/** Inputs that decide whether a carousel may advance on its own. */
export interface AutoplayConditions {
  /** The caller asked for autoplay at all. */
  requested: boolean;
  pointerInside: boolean;
  /** Focus is somewhere inside the carousel — keyboard users must not lose their place. */
  focusInside: boolean;
  documentHidden: boolean;
  reducedMotion: boolean;
}

/**
 * Autoplay stops for four separate reasons, and every one of them is a bug when missed:
 * a hovered carousel that keeps moving, a focused one that steals the slide out from under
 * a keyboard user, a background tab burning frames, and motion nobody asked for.
 */
export function shouldAutoplay(conditions: AutoplayConditions): boolean {
  if (!conditions.requested) return false;
  if (conditions.reducedMotion) return false;
  if (conditions.documentHidden) return false;
  if (conditions.pointerInside) return false;
  if (conditions.focusInside) return false;
  return true;
}
