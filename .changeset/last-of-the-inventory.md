---
'@ceebee/ui': minor
---

Combobox, DateInput with its own calendar, FileDrop, CommandPalette, Spinner, ProgressBar,
Timeline, and the onboarding Checklist.

The date parser reads ISO and day-first input, expands a two-digit year, and refuses 31 February
rather than rolling it into March; the calendar grid is always six weeks so the popover never
changes height. FileDrop reports every rejection with a reason instead of dropping files silently,
and keeps a real file input underneath the drop zone. The palette ranks an exact label above a
prefix, a word start, a substring, and finally a keyword — so "logout" finds "Sign out" — and ties
keep the caller's order.

`ScrollReveal` is dropped from the plan: `Reveal` and `Stagger` already take `onView`, which is the
same feature with one fewer component to maintain.
