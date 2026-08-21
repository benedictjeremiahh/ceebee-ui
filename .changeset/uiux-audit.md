---
'@ceebee/ui': patch
---

UI/UX audit pass.

Icon-only Buttons are square: with no children they drop the text padding, the gap and the empty
label span, so a row-action button is a 40px square with its glyph centred instead of a wide
control with an off-centre icon. DataTable is denser — header and cells at the smaller spacing
step, a fixed 3rem row height, the table's own gutter on the first and last cell, and no text
padding around a cell that holds only a control.

Accessibility: checkbox, radio and switch now present a 24×24 pointer target (WCAG 2.5.8) while
the visual box stays 18px, and a table's sort control fills its header cell rather than being a
14px-tall target. The coachmark and popover tail is a clipped rotated square carrying the popup's
own border, which joins the edge exactly — the hand-drawn SVG never did. Dialog placement uses
logical properties, so the corner variant follows the writing direction.
