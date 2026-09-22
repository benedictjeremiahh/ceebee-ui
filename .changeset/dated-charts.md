---
"@ceebee/ui": minor
---

Dated charts: `TimeSeriesChart`, `ProgressCurve` and `BalanceCurve`.

`TimeSeriesChart` is the primitive: a canvas plot of any number of dated series, an optional fixed
range and an optional baseline, with a `format` function the product owns. It holds no domain meaning.
Because a canvas is not in the accessibility tree, it ships a second rendering rather than a
description of the first — a table of every reading, always in the DOM, and shown *instead of* the
canvas under `forced-colors: active`. Tokens are read from the DOM with `getComputedStyle` and re-read
on every theme, Skin and system colour-scheme change; where they do not resolve, nothing is drawn
rather than a colour being invented.

`ProgressCurve` is the S-curve: planned against actual on a scale pinned to 0–100%, because autoscale
stretches a job at 30% to the full height of the plot and reads as "nearly there". The reading for a
given day is stated in words above it.

`BalanceCurve` is a running balance read against a line, drawn as a baseline series so the stretch
below the threshold is shaded by its own values. The threshold defaults to zero and is a prop: a
business that must keep a minimum on hand is in trouble well before it reaches nothing.

The plot is drawn by TradingView's `lightweight-charts` 5.2.1 (Apache-2.0), a new dependency imported
**dynamically inside the mount effect** — a server render never evaluates it, and a consumer that
shows no chart never downloads it. In a real consumer's production build it lands as its own chunk,
57 KB gzipped. Attribution is in `THIRD_PARTY_NOTICES.md`, which also gains the `@dnd-kit` entry
`Board` had been shipping without.

Also: `.cb-visually-hidden` now has a rule behind it. It was being written in markup with none, so the
text it claimed to hide was simply visible.
