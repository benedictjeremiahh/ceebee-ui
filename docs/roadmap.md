# Coverage roadmap

[`inventory.md`](./inventory.md) records what is built. This roadmap accounts for every entry in the
catalog baseline, audited on 2026-08-25.

The baseline's documented API, examples, methods, and behaviour are the compatibility target for
every adopted component. Ceebee keeps its own Tokens, Skins, semantic slots, interaction contracts,
and injected adapters. Lineage is pinned per component in `component-sources.json`. A catalog entry is
`built`, `replaced`, or `deliberately absent`; no entry may disappear merely because Ceebee solves it
differently.

## Catalog baseline

### General

| Component | Status | Ceebee coverage or intent |
|---|---|---|
| Button | built | `Button` |
| FloatButton | built | Persistent native viewport action; Group and BackTop remain separate interaction contracts |
| Icon | deliberately absent | Consumers provide icons; `lucide-react` is not re-exported |
| Typography | replaced | `Text` and `Heading`; flat exports rather than `Typography.*` |

### Layout

| Component | Status | Ceebee coverage or intent |
|---|---|---|
| Divider | built | `Divider` |
| Flex | built | `Flex` |
| Grid | built | `Grid` |
| Layout | replaced | `Sidebar`, `TopBar`, `Container`, and layout Recipes |
| Masonry | built | Responsive ragged-column layout with matching Skeleton |
| Space | built | `Space`, `Space.Compact`, and matching `Space.Skeleton`; `Flex` remains the general layout contract |
| Splitter | built | Controlled or uncontrolled two-pane pointer and keyboard resizing |

### Navigation

| Component | Status | Ceebee coverage or intent |
|---|---|---|
| Anchor | built | Native nested fragment navigation with injected active-section state |
| Breadcrumb | built | `Breadcrumb` |
| Dropdown | built | `Dropdown` |
| Menu | built | Persistent native-link navigation with nested disclosure branches; distinct from anchored `Dropdown` |
| Pagination | built | `Pagination` |
| Steps | built | `Steps` |
| Tabs | built | `Tabs` |

### Data Entry

| Component | Status | Ceebee coverage or intent |
|---|---|---|
| AutoComplete | built | `AutoComplete`, including injected `loadItems` |
| Cascader | built | Sequential column traversal through an injected hierarchy |
| Checkbox | built | `Checkbox` |
| ColorPicker | built | Semantic Tone selection through an anchored two-dimensional palette |
| DatePicker | built | `DatePicker`, including `RangePicker` for ordered intervals |
| Form | deliberately absent | `Field` owns a11y wiring; form engines and state stay in the app |
| Input | built | `Input` and `Textarea` |
| InputNumber | built | `InputNumber` |
| Mentions | built | Textarea-owned single-trigger entity references with anchored injected suggestions |
| Radio | built | `RadioGroup` |
| Rate | built | `Rate` |
| Select | built | `Select` |
| Slider | built | single and range selection with token-owned styling |
| Switch | built | `Switch` |
| TimePicker | built | `TimePicker`, `TimePicker.Skeleton` |
| Transfer | built | Controlled or uncontrolled assignment between two persistent checkbox lists |
| TreeSelect | built | Anchored single-value hierarchy selection composed from `Tree` |
| TreeSearchSelect | replaced | `TreeSelect` with `showSearch` |
| Upload | built | `Upload`, `Upload.Skeleton` |

### Data Display

| Component | Status | Ceebee coverage or intent |
|---|---|---|
| Avatar | built | `Avatar` and `AvatarGroup` |
| Badge | built | `Badge` |
| Calendar | built | Inline accessible month grid with injected static day content and matching Skeleton |
| Card | built | `Card`, `Card.Meta`, responsive `Card.Grid`, loading, tabs composition, and `Card.Skeleton` |
| Carousel | built | `Carousel` |
| Collapse | built | `Collapse` with controlled or uncontrolled single/multiple expansion and `Collapse.Skeleton` |
| Descriptions | built | Native label/value record details with `Descriptions.Item` and matching Skeleton |
| Empty | built | `Empty` |
| Image | built | `Image`, `Image.Skeleton`, and `Image.PreviewGroup` with grouped viewing, zoom, and matching grid Skeleton |
| List | built | deprecated upstream; `Listy` is the maintained replacement |
| Listy | built | Server-safe groupable list with opt-in browser-native rendering containment |
| Popover | built | `Popover` |
| QRCode | built | Server-safe accessible SVG matrix encoded by zero-dependency `uqr` |
| Segmented | replaced | `RadioGroup variant="segmented"`; same interaction contract |
| Statistic | built | `Statistic` and `Statistic.Skeleton` |
| Table | built | `Table` and `Table.Skeleton` |
| Tag | built | `Tag` |
| Timeline | built | `Timeline` and `Timeline.Skeleton` |
| Tooltip | built | `Tooltip`; layer delivery remains a decision |
| Tour | built | `Tour` and injected `SeenStore` |
| Tree | built | Accessible hierarchical display with roving focus, selection, and branch expansion |

### Feedback

| Component | Status | Ceebee coverage or intent |
|---|---|---|
| Alert | built | `Alert` |
| Drawer | built | `Drawer` |
| Message | built | `message`, with `Toast` remaining as the component-shaped alternative |
| Modal | built | `Modal`, composable `Modal.Confirm`, and `Modal.Skeleton`; anchored confirmation remains `Popconfirm` |
| Notification | built | Server-safe rich, longer-lived feedback with title and composable actions |
| Popconfirm | built | Anchored lightweight confirmation with composable actions; distinct from modal confirmation |
| Progress | built | one component covers the line, circle and dashboard forms |
| Result | built | Server-safe end-state composition with semantic status tones and matching Skeleton |
| Skeleton | built | Shape atoms and mandatory `X.Skeleton` compositions |
| Spin | built | `Spin` |
| Watermark | built | Token-driven SVG text tiling over preserved child interactions, with matching Skeleton |

### Other

| Component | Status | Ceebee coverage or intent |
|---|---|---|
| Affix | built | Native sticky layout within the nearest scroll container |
| App | deliberately absent | Consumers explicitly assemble the providers they use |
| BorderBeam | built | Client-bound decorative border with motion opt-out and reduced-motion rendering |
| ConfigProvider | replaced | `ThemeProvider`, `MotionProvider`, and `LabelsProvider` each own one job |
| Util | deliberately absent | React and Ceebee's exported prop types already provide type extraction |

## Pro Components

The Pro Components family is not a target. The recipes that used to map it onto this library were
removed: each described how to assemble a Pro pattern out of pieces already shipped here, which is
upstream's documentation to write. `PageContainer` remains because it is a page frame this library
owns, not a Pro mapping.

## Product-proven gaps

These are the strongest first delivery candidates because `ceebee-list` already implements them.

### Completed first delivery wave

1. **Card** — ships the full family in one slice: cover, header/title/extra, body,
   actions, size, surface variant, hover treatment, loading, tabs, `Card.Meta`, `Card.Grid`, and
   `Card.Skeleton`; this establishes the anatomy reused by ProCard-style compositions. `Card` stays
   server-safe: its tabs region composes the existing client `Tabs`, which continues to own tab
   state and keyboard behaviour. `hoverable` changes elevation only; it never adds click handling,
   a role, or a tab stop to the non-interactive Card. Visual treatment uses Surface's
   `plain | tinted | glass | gradient` vocabulary plus `bordered`; the outlined and borderless
   cases map to `bordered={true | false}`. Size follows Ceebee's `sm | md | lg` convention. The
   `actions` prop is a composable React node region rather than an array owned by Card. Both
   `loading` and direct `Card.Skeleton` usage render the same anatomy. The `title` region accepts a
   React node and never guesses a heading level; consumers provide the contextually correct heading.
   `Card.Grid` is a responsive grid container built on Ceebee's `Grid` contract rather than the upstream
   fixed-width grid cell. `Card.Meta` is the non-interactive avatar/title/description anatomy, and
   nested Card treatment is visual geometry only. Hover transforms drop under reduced motion. This
   slice stops at the library component, tests, docs, and a minor changeset; publishing and migrating
   `ceebee-list` are separate follow-up slices.
2. **Collapse** — removes two independent disclosure implementations. Built with controlled or
   uncontrolled single/multiple modes and a matching Skeleton.
3. **Modal confirmation** — extends the existing modal contract without conflating it with
   `Popconfirm`.
4. **Image preview** — replaces the largest product-owned interaction with grouped navigation,
   zoom, focus restoration, controlled state, and matching thumbnail-grid Skeleton coverage.

| Gap | Evidence today | Boundary note |
|---|---|---|
| Collapse | `PinsSheet` and `BulkLogSheet` each hand-roll disclosure rows | Decide single versus multiple expansion as state modes of the same disclosure contract |
| Modal confirmation | `ConfirmSheet.tsx` | A modal preset; not a substitute for anchored `Popconfirm` |
| Image preview | `Lightbox.tsx` | Full-screen zoom, swipe, next/previous, and focus restoration extend `Image` |
| Card | Repeated `.card`, `.card-body`, and `.card-actions` arrangements | A `Surface` composition with stable anatomy |

### Still awaiting a boundary decision

`Tooltip` wraps one trigger. `ceebee-list` also has `TooltipLayer`, one document listener serving
attribute-marked targets that may sit in clipped or stacked rows. This appears to be the same
interaction contract with a different delivery mechanism, so the boundary rule points toward one
`Tooltip` API rather than another public component.

### Compared and closed

`PhotoStrip` is not a Carousel gap. It uses native scroll snap and keeps every slide mounted to
control image-request volume. It also owns Google attribution, URL-suffix sizing, and dead-photo
handling, all of which are product knowledge and stay in the app.

## Taking an entry to built

Before implementation, record its role, keyboard and focus behaviour, state ownership, dismissal,
positioning, and gestures. If those match an existing component, extend only the visual
or geometric surface; otherwise create a separate public contract.

The delivery slice then includes Tokens-only CSS, one side of the client boundary, Base UI behaviour
where applicable, reduced motion, an `X.Skeleton` for every Composition, focused tests, its own
`cb-` namespace, and a docs page in the same change.
