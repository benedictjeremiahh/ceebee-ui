# The control ladder has a per-pointer floor

The control heights were `sm 2rem / md 2.5rem / lg 3rem`, chosen as a fine-pointer density scale, and
nothing raised them for a coarse pointer. A touch screen therefore got the same 40px `md` control as
a mouse, under the 44px minimum WCAG 2.5.5, Apple HIG, and Material all state. A consumer found this
auditing a phone-width layout: every form control landed at 40px, and the only way to reach 44px was
per-field CSS, which its own contract disallows.

Two floors now exist as Tokens. `--cb-control-floor-fine` is 2rem (32px), the smallest target a
pointer that hovers can hit; `--cb-control-floor-coarse` is 2.75rem (44px), the smallest a finger can.
`--cb-control-floor` names the active one, and `@media (pointer: coarse)` switches it. Each resolved
height is `max()` of a preferred step and the active floor, so the ladder's steps stay independently
tunable — a density scale retunes `--cb-control-height-base-*` — and no tuning can take a control
under its pointer's floor. `sm` and `md` both reach 44px on a touch screen; `lg` keeps its 48px.

We reject putting the coarse height on the ladder as a fourth size, because a consumer would then
have to know which pointer it is on to pick one, and the 40px `md` would stay a 40px target for
everyone who did not. We reject a `@media` rule that restates each step at 44px, because it is a
second copy of the ladder that drifts the first time a step is retuned. The floor belongs on the
token, where the step and the target cannot disagree.

The published convention (`xs 24 / sm 28 / md 36 / lg 44 / xl 52`) is a different ladder. Ceebee's
starts higher — `sm` 32 is already above that convention's `sm` 28 — and its `md` is 40 because the
library is drawn at a roomier base than a dense admin table. The top is `lg` 48; there is no `xl`
control, and none is added here: this change is about the floor, not the ceiling. A consumer that
wants the convention's tighter steps gets them by retuning `--cb-control-height-base-*`, and the
floor still holds.

CSS is the cross-platform source (ADR 0020), so the Flutter projection is generated from these
values. Flutter has no CSS custom-property cascade and sizes controls from its own platform metrics,
so the generator resolves the web `max()` to its fine-pointer step and deliberately does not carry
the floor Tokens.

`ThemeBridge` re-reads Ant's geometry on a `(pointer: coarse)` change, so a tablet that gains a mouse
mid-session does not keep the touch heights it loaded with.
