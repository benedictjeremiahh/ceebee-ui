---
"@ceebee/ui": minor
---

The themes declare `color-scheme`, so the browser's own chrome follows them: a dark theme no longer gets light scrollbars (a white track beside dark surfaces), light native pickers or light autofill. Scrollbars take one colour — the theme's foreground at low strength, no track — through the inherited `scrollbar-color`, and return to the system's under `forced-colors`.
