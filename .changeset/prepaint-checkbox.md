---
'@ceebee/ui': patch
---

Checkbox now paints from Tokens before Ant's stylesheet lands, instead of not painting at all.

A server-rendered `Checkbox` had no border and no background, so a reader saw nothing where a checkbox belongs until hydration, then the box appeared. It is now sized, bordered, and filled from Tokens at the first paint, and its label carries the same spacing Ant gives it, so the row no longer widens by 16px on hydration.

The size is derived rather than guessed: Ant's `controlInteractiveSize` is `controlHeight / 2`, confirmed against `theme.getDesignToken()`. Its 6px corner comes from `borderRadiusSM`, which no Ceebee Token carries, so no radius is stated — the box is square for one paint rather than wrong by two pixels in the other direction.

This also fixes a rule that had never matched anything: the box is `.ant-checkbox` itself in this runtime, not a `.ant-checkbox-inner` child.
