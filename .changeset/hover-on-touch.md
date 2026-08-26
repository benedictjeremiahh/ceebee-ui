---
"@ceebee/ui": patch
---

Guard every `:hover` rule behind `@media (hover: hover)`.

A touchscreen has no hover, so a browser applies `:hover` on tap and leaves it
applied until something else is touched. Every pressable surface in this
package — buttons, tags, tabs, table rows, calendar days, select options —
therefore stayed lit after a finger passed over it, and a scroll left a trail of
controls looking pressed. It was reported as "everything I scroll past gets
clicked", which is exactly what it looks like.

44 rules across 27 files. Where a selector list mixed `:hover` with
`:focus-visible` or `[data-active]`, only the hover half moved: keyboard focus
and keyboard selection are not hover, and both must keep working on a device
that cannot hover.
