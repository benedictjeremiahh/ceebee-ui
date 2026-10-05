---
'@ceebee/ui': patch
---

Localize the InputNumber stepper buttons through `LabelsProvider` instead of the English literal Ant writes.

`@rc-component/input-number` sets the stepper's accessible name in the element itself as `Increase Value` / `Decrease Value`, with no prop and no locale hook to change it — `StepHandler` takes no rest props — so a consumer could not name them. They now read from `Labels.increase` / `Labels.decrease`, like the Select clear button. The role, keyboard model, focus, hold-to-repeat and geometry stay Ant's, and the component adds no element, so consumer layouts and the accessibility tree are unchanged.

Removable once `@rc-component/input-number` accepts a label or locale for its steppers.
