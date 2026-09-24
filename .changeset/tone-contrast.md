---
"@ceebee/ui": minor
---

Every tone reads at WCAG AA both as text and as a fill, in every skin, theme and contrast mode. Light mode darkens the tones so they carry light text; dark mode lightens them so they read on a dark surface, and the text on a tone (`--cb-fg-on-brand`, `--cb-on-warning`) turns dark. Tooltip, Tour and Image preview keep light text through the new `--cb-fg-on-dark`. Checked by `tone-contrast.spec.ts`.
