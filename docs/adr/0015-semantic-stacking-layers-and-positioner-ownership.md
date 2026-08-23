# 0015 — Global stacking follows one semantic ladder

Every global interaction layer uses the shared stacking ladder, ordered from ordinary page chrome
through modal work, anchored controls, informational overlays, commands, notifications, and guided
onboarding. Components do not compete by inventing a larger number.

The current order is: sticky chrome; modal backdrop and modal; dropdown; popover; tooltip; command
backdrop and command; toast; coachmark spotlight and coachmark. A dropdown must remain above a modal
because Select, Combobox, DateInput, and TimeInput can be used inside Dialog or Drawer. Coachmarks sit
last because a guided step must point through every ordinary application surface.

For a portalled anchored layer, Base UI's `Positioner` owns the transform and stacking context, so it
also owns the semantic `z-index`. Putting the value on `Popup` cannot lift it out of a lower ancestor
stacking context. Fixed modal pairs assign separate backdrop and content rungs. Small `0`/`1` values
remain valid for children that only stack within their component.

The exact numbers are implementation details. Their strict relative order, uniqueness, semantic
names, and Positioner ownership are regression-tested because those are behavioral contracts.
