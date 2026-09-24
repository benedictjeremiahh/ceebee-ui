---
"@ceebee/ui": minor
---

Dates a person reads are written in the product's language. `TimeSeriesChart` (and every Composition over it — `BalanceCurve`, `ProgressCurve`) takes a `locale`, defaulting to the document's `lang`, and uses it for the time axis, the accessible table's day column, and `BalanceCurve`'s reading sentence. The axis is rounded outwards to ticks of 1, 2 or 5 times a power of ten, so a compact formatter is no longer handed a value it must answer with a trailing decimal.
