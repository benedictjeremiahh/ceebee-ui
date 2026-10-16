const FONT_FACE_RULE = /@font-face\s*\{[^{}]*\}/gi;

/** Remove the pinned flat substrate font declarations; component typography comes from Tokens. */
export function withoutFontFaceRules(css) {
  return css.replace(FONT_FACE_RULE, '');
}
