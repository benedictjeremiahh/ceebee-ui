---
"@ceebee/ui": minor
---

`DiagramEditor` adds nodes from a `palette` — dragged onto the canvas, or tapped / Enter for the middle of the view — as `onAddNode({ kind, position })` requests in whole cells, and renames a node in place through `editingId`, `onRenameSubmit` and `onRenameCancel`. In both `Diagram` and `DiagramEditor`, scroll and a two-finger swipe now pan; pinch, Ctrl/⌘ + scroll and the controls zoom.
