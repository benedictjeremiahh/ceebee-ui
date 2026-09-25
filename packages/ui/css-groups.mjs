/**
 * The source folders whose stylesheets build-css.mjs concatenates into dist/styles.css, besides the tokens
 * and skins it orders itself. A component's CSS outside these folders is silently left out of the bundle —
 * Select's was, until src/css-groups.spec.ts made it a failing test.
 */
export const CSS_GROUPS = ['foundation', 'form', 'feedback', 'overlay', 'data', 'media', 'nav', 'motion', 'onboarding', 'theme'];
/** Folders whose CSS build-css.mjs reads by name rather than by walking. */
export const CSS_ORDERED = ['tokens', 'skins'];
