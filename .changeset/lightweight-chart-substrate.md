---
'@ceebee/ui': major
---

Use Lightweight Charts for CashFlowChart, Sparkline and BarMini. CashFlowChart now supports `formatExact` for full-precision hover, focus and accessible table values while keeping a compact axis formatter. Donut and TargetBars remain non-time-series exceptions.

Migration: import `Sparkline`, `BarMini`, `SparklineProps` and `BarMiniProps` from `@ceebee/ui/client` instead of `@ceebee/ui`. They now mount a client-only chart. Remove imports of `sparklineGeometry`, `SparklineGeometry`, `cashFlowScale`, `CashFlowScale` and `heightOf`; the chart substrate owns scale and geometry, and those helpers no longer exist. Consumers that abbreviate cash values should pass a currency-aware `formatExact` in addition to the compact `format`.
