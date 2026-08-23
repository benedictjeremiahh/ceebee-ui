---
"@ceebee/ui": patch
---

Two fixes to overlays measured on a phone-sized viewport.

**A scrolling dialog's scrollbar no longer lands on its fields.** `Modal`'s body
became an internally scrolling box in 0.5.0 so long content stays in the
viewport; a scroller draws its bar at its own inline edge, and the body ran to
the dialog's content edge. Measured at 390×780: the first input ran 41→349
inside a 349-wide scroller — no gap at all. macOS and Android float an overlay
bar over the field; Windows reserves width and squeezes it.

`.cb-modal__body` and `.cb-drawer__body` now set `scrollbar-gutter: stable` and
bleed into the dialog's own padding to put it back as their own, so the bar is
drawn over padding rather than over content on either kind of platform. It also
stops a focused field's ring being clipped at the scroller's edge.

**A `Select` or `AutoComplete` popup is as wide as its options need.** Both were
pinned to `--anchor-width`. Dropping from a field that is half a filter row —
175px on a phone — options that are place names wrapped to two and three lines
each: measured heights of 56, 56, 56, 76, 56 against 36 apiece once the popup
sizes to its content.

The anchor's width is the floor now rather than the value, so a popup is still
never narrower than the field it belongs to, and the ceiling is
`--available-width`, the room the positioner measured. `max-height` follows the
same shape, so a long list on a short screen is bounded by the screen.

No API changes; both are CSS, and both apply to every consumer on the next
install.
