# The documentation site is a Next app built with the library, not Storybook

Docs live in a Next 16 app in this repo: one MDX page per component with anatomy, props, do/don't,
live editable examples, and the Tokens it consumes, plus Recipes reproducing whole screens. Storybook
was rejected because a design system whose selling point is how it feels should not be presented in a
chrome that belongs to someone else — and because building the docs *with* the library makes every
rough edge visible to its author first.

## Consequences

- The docs app is the first consumer, so packaging bugs (exports map, styles import, server/client
  split) surface before any other project meets them.
- Interaction and visual-regression testing is not obtained for free; it stays a deliberate choice
  under ADR 0012.
