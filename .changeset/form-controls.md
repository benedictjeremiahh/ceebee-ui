---
'@ceebee/ui': minor
---

Completes the form controls: Select (a themed listbox on Base UI, not a native `<select>`),
Checkbox with an indeterminate state, RadioGroup with per-option descriptions, Switch with a
settings-row layout, and NumberInput whose arithmetic — parsing a comma decimal, clamping on blur
rather than on keystroke, stepping without floating-point crumbs, and treating an empty field as
`null` — is a pure module with its own tests.

Every control takes its label, description wiring, and error state from `Field`, and every
callback now receives the value alone: Base UI's second argument no longer leaks through
`Checkbox` and `Switch`.
