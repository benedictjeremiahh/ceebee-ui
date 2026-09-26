---
"@ceebee/ui": patch
---

`Select`'s stylesheet actually ships. `build-css.mjs` concatenates the CSS of named source folders, and Select sat outside every one of them, so its width cap and ellipsis never reached `dist/styles.css` — a form at 360px scrolled sideways for want of them. Select moves into a bundled folder, and the folder list moves to `css-groups.mjs`, shared by the build and a spec that fails when any stylesheet sits outside it, so the next one cannot go missing quietly.
