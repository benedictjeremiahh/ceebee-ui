---
"@ceebee/ui": minor
---

DiagramEditor gains `renderInspector`: the selected node or edge, described with its incoming and outgoing links, rendered in a consumer panel beside the canvas (below it on a narrow screen) so actions are real buttons and work on touch. Diagram and DiagramEditor open fitted at a readable zoom (never below 0.8×), wrap labels to two lines with the full label as a tooltip, take `legendLabels` for a legend of the shapes in use, and theme their controls with tokens. `describeSelection` and `shapesInUse` are exported.
