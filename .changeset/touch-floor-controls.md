---
"@ceebee/ui": minor
---

Give the control ladder a coarse-pointer floor at the 44px touch target.

The control heights were `sm 2rem / md 2.5rem / lg 3rem` with no size at the 44px
minimum and no coarse-pointer rule, so a touch screen got the same 40px controls
as a mouse. A consumer had no supported way to reach 44px without per-field CSS,
which its contract disallows.

`--cb-control-floor-fine` (2rem, 32px) and `--cb-control-floor-coarse`
(2.75rem, 44px) now name the floor for each pointer, and `--cb-control-floor`
points at the active one. `@media (pointer: coarse)` switches it to the coarse
floor. Each resolved height is `max()` of a preferred step
(`--cb-control-height-base-*`) and that floor, so `sm` and `md` both reach 44px
on a touch screen and `lg` keeps its 48px, while a density scale can retune the
ladder but never take a control under the target its pointer can hit.

Existing tokens keep their names and their fine-pointer values. `ThemeBridge`
now re-reads Ant's geometry when the pointer changes, so a device that gains or
loses a mouse mid-session stays in step.
