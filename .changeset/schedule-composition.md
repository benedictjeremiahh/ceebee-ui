---
"@ceebee/ui": minor
---

`Schedule`: a new Composition that draws items against a time axis — one row per item, a bar from its planned start to its planned end, the reported progress as a fill, and a late item toned danger.

It is built on `@svar-ui/react-gantt` 2.7.3 (MIT), bundled into `styles.css` the way React Flow is for `Diagram`, and themed through the substrate's `--wx-*` properties so a Skin or a theme moves it with everything else.

Today is named above the axis, and lateness is read from the plan's own dates and progress, because the substrate's vertical markers and critical path are **PRO** features that the free build ignores silently.

`@svar-ui/react-gantt` is a new dependency.
