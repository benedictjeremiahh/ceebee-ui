---
"@ceebee/ui": patch
---

Read Skin tokens on the first client render instead of in an effect, so a themed page no longer flashes Ant's own default palette before the Skin arrives.
