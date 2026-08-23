---
'@ceebee/ui': minor
---

**Breaking: fifteen components are renamed to the names Ant Design uses (ADR 0016).**

The old names are gone, not deprecated. A consumer upgrading to this release has
to rename its imports; nothing warns at runtime, the build simply stops finding
them.

| Was | Now |
|---|---|
| `Stack` | `Flex` |
| `StatCard` | `Statistic` |
| `Breadcrumbs` | `Breadcrumb` |
| `Dialog` | `Modal` |
| `Combobox` | `AutoComplete` |
| `EmptyState` | `Empty` |
| `DataTable` | `Table` |
| `Spinner` | `Spin` |
| `TextInput` | `Input` |
| `DateInput` | `DatePicker` |
| `TimeInput` | `TimePicker` |
| `NumberInput` | `InputNumber` |
| `FileDrop` | `Upload` |
| `DropdownMenu` | `Dropdown` |
| `Stepper` | `Steps` |

The `cb-` class namespaces moved with them, so a consumer that styles against
`.cb-dialog` or `.cb-stack` has to follow. `DialogClose` keeps its name because
Base UI's own part is called that.

Known callers at the time of writing: `ceebee-home` uses `Stack` in 26 places;
`ceebee-monitor` uses `Stack` in 53, `StatCard` in 20 and `Breadcrumbs` in 2.
Neither picks this up on its own — a caret range on a 0.x version does not cross
a minor — so both stay on what they have until somebody bumps them deliberately.

Also in this release:

- **`Tag`** — Badge's interactive sibling. Pressing it and removing it are two
  gestures, so they are two props (`onClick`/`pressed`, and `onClose`).
- **`Rate`** — a row of stars that is a radiogroup, readable as well as
  settable. Pressing the current score clears it.
- **`Divider`** — a bare `<hr>`, or a `role="separator"` when it carries a label.
