# 0014 — Component boundaries follow interaction contracts

Every existing or proposed component is classified by semantic role, keyboard/focus model,
state/value ownership, dismissal, anchoring/layout, and gesture model. A material difference in any
dimension creates a separate public component. Visual similarity is not evidence of one contract.

`variant`, `size`, `tone`, and `placement` may change appearance or geometry only. They must not
change role, keyboard behavior, focus movement, controlled value shape, dismissal, or gestures.
Components may share Base UI foundations and private utilities, while keeping separate props,
documentation, regression tests, and `cb-` CSS namespaces.

Modal/Drawer and Popover/Menu are the canonical examples. (Modal was called Dialog when this
was written; the pairing is unchanged — see ADR 0016.) The same decision applies to future
controls and compositions: Button is not Toggle, Select is not AutoComplete, Alert is not Toast, and
Tabs are not navigation merely because the treatments could look alike.

This follows the headless-library model: Base UI and Radix expose patterns around established ARIA
semantics and behavior while keeping their APIs composition-friendly. Base UI notes that a simple
edge panel can reuse Dialog behavior internally; this ADR governs our public design-system contract,
so a navigation or task Drawer remains independently named even when its engine is Dialog.

References:

- https://base-ui.com/react/overview/accessibility
- https://base-ui.com/react/components/dialog
- https://www.radix-ui.com/primitives/docs/overview/accessibility
- https://www.radix-ui.com/primitives/docs/components
