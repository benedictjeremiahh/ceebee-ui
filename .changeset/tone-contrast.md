---
"@ceebee/ui": minor
---

Every tone reads at WCAG AA both as text and as a fill, in every skin, theme and contrast mode. Light mode darkens the tones so they carry light text; dark mode lightens them so they read on a dark surface, and the text on a tone (`--cb-fg-on-brand`, `--cb-on-warning`) turns dark. Tooltip, Tour and Image preview keep light text through the new `--cb-fg-on-dark`. Filled tags and alerts sit on designed per-mode grounds (`--cb-tone-*-bg`) instead of the muddy tint Ant generated from a dark seed, and Ant's preset colours (`<Tag color="gold">`, a green badge) paint with designed per-mode steps that clear AA — Ant's own gold measured 2.76:1. Checked by `tone-contrast.spec.ts`.
