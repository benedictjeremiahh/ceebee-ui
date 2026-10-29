---
'@ceebee/ui': patch
---

Dismiss an open DatePicker when viewport width changes so responsive form layout cannot strand the
calendar outside the visible area. Preserve its selected date, focus, controlled open callbacks and
height-only resize behavior for mobile keyboards.

Consume Escape while the calendar is open so one keypress does not also dismiss its enclosing dialog.
