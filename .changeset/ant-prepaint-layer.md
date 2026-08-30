---
'@ceebee/ui': minor
---

Ant's primitives now paint from Ceebee Tokens before Ant's own JavaScript-generated CSS arrives.

A server-rendered document carries Ant's class names and none of its rules, so buttons, inputs, selects, and segmented controls painted as native browser controls until hydration — a square grey button on a Ceebee surface, in both colour modes. `styles.css` now carries a pre-paint layer for those classes, authored from Tokens and wrapped entirely in `:where()` so it has no specificity and every real Ant rule overrides it the moment it lands. It reads Ant's own server-rendered variant and size classes, so a text button does not borrow a surface for the length of the first paint.

Consumers get this by importing `@ceebee/ui/styles.css` as before; nothing to configure. Note that server-extracting Ant's rules with `@ant-design/nextjs-registry` is still not recommended — Ant's seed comes from live CSS Tokens, which a server cannot read, so extracted rules carry Ant's default light palette. See `docs/adr/0022-ceebee-paints-ant-primitives-before-ant-does.md`.
