---
"@ceebee/ui": minor
---

The Board says when columns are hidden past an edge: a shade on the side(s) that hide one, and `‹ ›` buttons that scroll by exactly one column, keyboard reachable, with `motion` or the reader's `prefers-reduced-motion` choosing smooth or instant. A column given a height ceiling (`--cb-board-max-block-size`) scrolls its own cards, so the header naming it stays in view and the horizontal scrollbar sits under the columns. `BoardColumn.collapsed` lets a consumer keep a column — an empty stage of a workflow, say — as a narrow labelled strip the reader opens, which stays a drop target carrying its count. `--cb-board-column-inline-size` sets the lane width. `BoardLabels` gains `scrollBack`, `scrollOn`, `expand` and `collapse`.
