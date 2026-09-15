---
"@ceebee/ui": minor
---

`Diagram` and `DiagramEditor`: nodes joined by arrows on a grid, built on the React Flow runtime
(`@xyflow/react` 12.11.6, MIT) and skinned by Tokens.

`Diagram` renders a diagram read-only — pan, zoom and fit controls, nothing focusable or draggable — and
describes its viewport by an outline list for assistive technology. `DiagramEditor` is a separate
interaction contract: React Flow's own model for dragging, selecting, deleting and connecting between node
handles (by dragging or by clicking one handle then another, which works on touch), with every change
turned into a request (`onMoveNode` in whole cells, `onConnect`, `onRemove`, `onRename`) so the caller owns
the data and decides what is valid. It adds keyboard connecting, which the runtime does not offer: `C` on
one node and `C` on another.

React Flow's base stylesheet is included in `styles.css`; consumers import nothing from the substrate.
`@xyflow/react` is a new dependency. Not included: automatic layout, grouping, undo and a minimap.
