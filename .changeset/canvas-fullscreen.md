---
"@ceebee/ui": minor
---

`PanZoomCanvas` now offers fullscreen from its own toolbar, beside zoom and reset.

A canvas is usually laid out inside a page column narrower than the diagram it holds. The documented
answer used to be composing the canvas inside `Drawer` or `Modal`, which produced a separate trigger,
a sheet to dismiss, and a canvas sized to the sheet rather than the screen.

The control uses the browser's Fullscreen API, so the browser promotes the element above every
stacking context, keeps focus inside it, and closes it on `Escape`. The component adds no dismissal
contract, focus trap, or `z-index` of its own. Where the API is unavailable the control is not
rendered, rather than offered and inert.

New optional props: `fullscreenLabel` and `exitFullscreenLabel`.
