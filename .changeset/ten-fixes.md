---
'@ceebee/ui': minor
---

Adds `TimeInput`, and fixes a run of defects found by reading the running site.

The Coachmark bubble was painted **under** its own spotlight: the z-index sat on a
`position: static` popup, where it does nothing, while the spotlight's own layer stacked above it.
It now lives on the positioner Base UI portals.

Combobox handed Base UI a bare string where it expects whole items, so the field displayed the id
("id" instead of "Indonesia") and selection returned an object the caller could not use. The
mapping now happens inside the component, and its options have an even rhythm whether or not they
carry a description line.

Disabled controls were only dimmed, which reads as nothing at a glance. A disabled checkbox, radio
or switch now loses its fill and takes a dashed edge, and disabled menu, select and tab items are
struck through.

Also: clicking a DateInput field opens its calendar rather than only the trailing button, the
FileDrop zone is a single label so the picker opens exactly once from anywhere in it, and a Toast
with an action lays its button out on its own row instead of squeezing it beside the text.

Dark mode was hard to read: panel edges measured 1.37:1 against their surface where WCAG asks 3:1
of a control boundary, and the two page greys were 1.09:1 apart. The ramp is re-spread — control
edges now measure 3.45:1 in dark and 3.0:1 in light.
