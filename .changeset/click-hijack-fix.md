---
'@ceebee/ui': patch
---

Fixes a click hijack introduced by the hit-target work: `.cb-switch::before` carried the 24px
pointer target, but the switch establishes no containing block, so the pseudo-element grew to the
width of a distant ancestor and swallowed clicks across the page — on the Button docs page, every
click toggled the loading switch. The switch never needed it (it is already 40×24), and the rule
now applies only to checkbox and radio, which are positioned.

A test locks the invariant: any absolutely positioned, percentage-sized pseudo-element must sit on
a host that is itself positioned. It is checked in the CSS because jsdom has no layout to measure.
