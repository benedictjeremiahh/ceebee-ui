---
'@ceebee/ui': minor
---

Leaderboard and a blur-up Image, which completes the planned inventory.

Leaderboard is an ordered list with an optional medal tint on the top three and a marker for the
viewer's own row. Image reserves its space through `aspectRatio` and fades in over a blurred
placeholder — and it checks `complete` on the ref, because a cached image can finish loading
before React attaches `onLoad`, which is the bug that leaves the frame permanently blank.
