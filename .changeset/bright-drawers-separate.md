---
'@ceebee/ui': minor
---

Add an independent Drawer primitive and keep overlay interaction contracts separate. Establish a semantic stacking ladder for every portalled or fixed layer, with anchored overlays layered by their Positioner. Keep long Dialog content within the viewport with an internally scrolling body. Fix horizontal Popover and Coachmark arrows, and give Tooltip matching placement and optional-arrow controls. Let Combobox fetch its options per query with loadItems, debounced, guarded against out-of-order replies, and with browser-side matching switched off so a server's answer survives intact. Give RadioGroup a segmented variant for the two-to-four-option band where a Select costs a press for nothing, and align Combobox's option and id props with Select's so swapping between them is one word. Add LinkButton for the anchor that wears a button's look, sharing the button's classes rather than a second copy of them, with a render seam so a router's own Link stays itself.
