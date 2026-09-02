---
"@ceebee/ui": patch
---

Map `colorTextDisabled` so a disabled control's label stays readable.

The runtime derived its disabled foreground from its own algorithm rather than from any token the
theme bridge sent, landing on a 25%-alpha grey: 1.19:1 against a light stage and 2.08:1 against a
dark one. WCAG exempts inactive controls from 1.4.3, and that exemption is the wrong thing to lean
on — the label on a disabled control is exactly what tells a person why it is disabled and what
would enable it, so it is the one piece of text on that control that has to survive.

The muted foreground rather than the subtle one, for the reason `colorTextPlaceholder` already
records: subtle clears AA against the plain surface and nothing else, while a disabled control sits
on a translucent wash over whatever surface a product put it on. Disabled still reads as disabled
through its border and its ground, neither of which depends on colour.
