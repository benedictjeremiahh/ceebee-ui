# Fullscreen belongs to the canvas, not to an overlay around it

`PanZoomCanvas` previously documented that it owned no fullscreen surface, and told a Product that
needed one to compose the canvas inside `Drawer` or `Modal`. In practice that produced a separate
trigger, a sheet to dismiss, and a canvas sized to the sheet rather than the screen — a consumer
measured its canvas at 356 pixels inside a 390-pixel viewport, where nothing remained to pan and the
sheet added a step without adding room.

The canvas now carries its own fullscreen control beside zoom and reset, built on the browser's
Fullscreen API. The browser promotes the element above every stacking context, keeps focus within it,
and closes it on `Escape`, so the component adds no dismissal contract, no focus trap, and no
`z-index` — the three things a hand-built overlay would have had to invent and keep correct.

The cost is that the API is not universal: iOS Safari does not expose it for arbitrary elements.
Rather than render a control that silently does nothing, the canvas resolves availability after mount
and omits the control where it cannot act. A Product that still needs a full-screen surface on those
browsers composes one, exactly as before; it is simply no longer the only way to get one anywhere.
