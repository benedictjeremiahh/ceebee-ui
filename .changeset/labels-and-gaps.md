---
'@ceebee/ui': minor
---

Closes the gaps the audit listed.

`LabelsProvider` puts every string the library says out loud in one place — carousel and pagination
controls, date and time triggers, file drop copy, stepper arrows, the shell's collapse button, and
the Tour's buttons. Override only what you translate; the rest fall back to English. A Tour's own
`labels` prop still wins, because one tour may speak differently from the product around it.

Sidebar items take `items` for one level of children: expanded they are a disclosure with an
indent rail, and collapsed the rail's hover flyout carries the label and the whole submenu, so a
collapsed sidebar is readable rather than a column of guesses.

Also: `Leaderboard.Skeleton` and `Timeline.Skeleton`, a `truncate` flag per table column,
`ToastProvider position` (six logical placements, with a top stack entering from above), and
`prefers-contrast: more` support in the tokens. Accessibility is now checked by axe in the test
suite, across form controls, data display, navigation and feedback.
