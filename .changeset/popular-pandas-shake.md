---
"@ceebee/ui": patch
---

Fix popups opened from an above-drawer Modal rendering underneath it. The dialog now reports its resolved rung through Ant's own `zIndex`, so date pickers, selects, dropdowns and tooltips derive a rung above the dialog instead of Ant's unpinned arithmetic.
