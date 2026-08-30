---
'@ceebee/ui': patch
---

The Ant pre-paint layer no longer states constraint properties, which an Ant rule cannot override.

`:where()` guarantees Ant wins for the same property, not for a different one. `min-height` and `min-width` are constraints Ant does not set — it sets `height` and `width` — so 1.4.0's values survived every Ant rule and permanently changed control geometry. In a consumer's header that widened the icon-only buttons until the brand overlapped them at 360px, caught by that product's own layout test before it reached production.

Buttons now state `height`, which Ant does set. The icon-only rule keeps padding and drops its width floor. Inputs, selects, and segmented controls state only colour, border, radius, and type — never size — because their sizing was not measured the way Button's was, and a size this layer got wrong would outlive every override. A test now rejects any `min-*` or `max-*` property in the layer.
