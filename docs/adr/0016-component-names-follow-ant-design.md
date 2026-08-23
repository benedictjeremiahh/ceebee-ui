# 0016 — Component names follow Ant Design

Where a component here does the same job as one in
[Ant Design](https://ant.design/components/overview), it takes Ant's name.

Ant is the breadth this library is aiming at, and a name a person already knows costs nothing to
learn. Fifteen components were renamed:

| Was | Now | Ant |
|---|---|---|
| `EmptyState` | `Empty` | [Empty](https://ant.design/components/empty) |
| `DataTable` | `Table` | [Table](https://ant.design/components/table) |
| `Stepper` | `Steps` | [Steps](https://ant.design/components/steps) |
| `StatCard` | `Statistic` | [Statistic](https://ant.design/components/statistic) |
| `Breadcrumbs` | `Breadcrumb` | [Breadcrumb](https://ant.design/components/breadcrumb) |
| `NumberInput` | `InputNumber` | [InputNumber](https://ant.design/components/input-number) |
| `DateInput` | `DatePicker` | [DatePicker](https://ant.design/components/date-picker) |
| `TimeInput` | `TimePicker` | [TimePicker](https://ant.design/components/time-picker) |
| `FileDrop` | `Upload` | [Upload](https://ant.design/components/upload) |
| `DropdownMenu` | `Dropdown` | [Dropdown](https://ant.design/components/dropdown) |
| `TextInput` | `Input` | [Input](https://ant.design/components/input) |
| `Combobox` | `AutoComplete` | [AutoComplete](https://ant.design/components/auto-complete) |
| `Dialog` | `Modal` | [Modal](https://ant.design/components/modal) |
| `Spinner` | `Spin` | [Spin](https://ant.design/components/spin) |
| `Stack` | `Flex` | [Flex](https://ant.design/components/flex) |

The `cb-` CSS namespace travels with the name, and so does the file: `cb-dialog__footer` is
`cb-modal__footer`, `overlay/dialog.tsx` is `overlay/modal.tsx`.

## What this cost, and why it was paid anyway

Four of these were argued against before the decision, and the arguments were real:

- **`Combobox` is the ARIA role name**, and the name Base UI uses for the primitive underneath.
  Renaming it means the public name and the engine's name now differ, and a contributor reading
  `autocomplete.tsx` finds `BaseCombobox` inside it.
- **`Dialog` was named in ADR 0014** as one half of the canonical Dialog/Drawer pair. That ADR's
  text now says `Dialog` where the component says `Modal`; the pairing it describes is unchanged.
- **`Spin` is worse English than `Spinner`** — a verb where a noun is meant.
- **`Stack` was one component** where Ant has two (`Flex` and `Space`). It became `Flex`, which is
  the closer of the two; nothing here plays `Space`'s role.

The trade taken: a name someone already knows is worth more than a name that is locally better.
Anyone can look a component up on ant.design and find it here.

## What was NOT renamed, and why

These are not naming differences, so a rename would not have made them Ant's:

| Here | Ant | Why not |
|---|---|---|
| `ProgressBar`, `ProgressRing` | [Progress](https://ant.design/components/progress) | Two components, one Ant name — a rename would collide them |
| `Textarea` | `Input.TextArea` | Compound; the library exports flat components |
| `RadioGroup` | `Radio.Group` | Compound |
| `AvatarGroup` | `Avatar.Group` | Compound |
| `Text`, `Heading` | `Typography.*` | Compound |
| `Sidebar`, `TopBar` | `Layout.*` | Compound |
| `Toast` | [message](https://ant.design/components/message) | Ant's is an imperative API, not a component |
| `Field` | `Form.Item` | A different thing: `Field` is the a11y wiring around one control and owns no form state (ADR 0011) |

Turning the compounds into `X.Y` is a structural change, not a rename, and is not decided here.

References:

- https://ant.design/components/overview
