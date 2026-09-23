---
"@ceebee/ui": minor
---

`ThemeProvider` takes a `locale` — one of the locale exports such as `idIDLocale` — so the strings the component runtime draws itself ("No data", "Select date", pagination) follow the product's language, static dialogs included. The locale objects were already exported; there was no way to apply them.

`ProgressCurve` takes `dayLabel` for its table's day column and `formatNumber` for the numbers in its reading, so a product that marks decimals with a comma no longer shows `74.4%` beside its own `74,4`. Defaults are unchanged.
