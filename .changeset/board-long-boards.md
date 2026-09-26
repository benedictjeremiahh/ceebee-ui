---
"@ceebee/ui": minor
---

`Board` for long boards (ceebee-ui#43): the `collapsed` column prop is deprecated and ignored — an empty column renders at full width with its `empty` content; columns default to 20rem; each column is as tall as its cards up to the viewport less `--cb-board-offset` (14rem) and then scrolls its cards under a header that stays, so the page does not scroll to reach a column's end; a card title clamped to two lines carries its whole text as a tooltip; badges in `meta` wrap. Also fixes a hydration mismatch: the drag-and-drop ids now come from React's `useId`, so a server render and the client agree.
