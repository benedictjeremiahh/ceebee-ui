---
'@ceebee/ui': minor
---

Board: a Kanban Composition whose cards move by pointer and by keyboard

Columns with names, counts and an optional work-in-progress marker; cards carrying whatever a person
triages by; and movement as the affordance the pattern is named for. Pointer dragging is `@dnd-kit`'s,
with autoscroll, a drop marker and a carried card; the keyboard path is the board's own — Space to pick
up, arrows to move, Space to drop, Escape to cancel — because a column that accepts nothing must be
stepped over rather than offered, and a card crossing columns should keep its depth.

Both hands reach one callback with the same move, over pure rules they share, so they cannot disagree
about where a card lands. A move applies optimistically and is then validated by the consumer: return
`{ refused }` or reject, and the board restores what was there and announces why. An accepted move
leaves an Undo, which is an ordinary move back. Every step is announced in a polite live region.

On a narrow viewport the board renders as lanes — one column behind a switcher — rather than squeezing
its columns. Ships `Board.Skeleton`, a reduced-motion rendering that keeps the drop marker, and a
forced-colors rendering.
