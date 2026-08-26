# Ant Design coverage roadmap

[`inventory.md`](./inventory.md) records what is built. This roadmap accounts for every entry in
[Ant Design 6.6.1's component overview](https://ant.design/components/overview) and every documented
[Pro Components](https://procomponents.ant.design/en-US/components/) family as audited on
2026-08-25.

Ant is a reference catalog, not a runtime dependency or an API-compatibility target (ADR 0017).
Ceebee keeps its own public APIs, Tokens, Base UI behaviour, interaction contracts, and injected
adapters. A catalog entry is `built`, `replaced`, `recipe`, or `deliberately absent`; no entry may
disappear merely because Ceebee solves it differently.

For Pro Components, coverage is counted by documented family. Compound parts, specialised forms,
and workflow variants are listed under their parent. Reusable interaction and layout contracts ship
from the package; workflows that own fetching, routing, auth, persistence, or form state live as
docs-only Recipes.

## Ant Design 6.6.1 baseline

### General

| Ant | Status | Ceebee coverage or intent |
|---|---|---|
| Button | built | `Button` |
| FloatButton | built | Persistent native viewport action; Group and BackTop remain separate interaction contracts |
| Icon | deliberately absent | Consumers provide icons; `lucide-react` is not re-exported |
| Typography | replaced | `Text` and `Heading`; flat exports rather than `Typography.*` |

### Layout

| Ant | Status | Ceebee coverage or intent |
|---|---|---|
| Divider | built | `Divider` |
| Flex | built | `Flex` |
| Grid | built | `Grid` |
| Layout | replaced | `Sidebar`, `TopBar`, `Container`, and layout Recipes |
| Masonry | built | Responsive ragged-column layout with matching Skeleton |
| Space | built | `Space`, `Space.Compact`, and matching `Space.Skeleton`; `Flex` remains the general layout contract |
| Splitter | built | Controlled or uncontrolled two-pane pointer and keyboard resizing |

### Navigation

| Ant | Status | Ceebee coverage or intent |
|---|---|---|
| Anchor | built | Native nested fragment navigation with injected active-section state |
| Breadcrumb | built | `Breadcrumb` |
| Dropdown | built | `Dropdown` |
| Menu | built | Persistent native-link navigation with nested disclosure branches; distinct from anchored `Dropdown` |
| Pagination | built | `Pagination` |
| Steps | built | `Steps` |
| Tabs | built | `Tabs` |

### Data Entry

| Ant | Status | Ceebee coverage or intent |
|---|---|---|
| AutoComplete | built | `AutoComplete`, including injected `loadItems` |
| Cascader | built | Sequential column traversal through an injected hierarchy |
| Checkbox | built | `Checkbox` |
| ColorPicker | built | Semantic Tone selection through an anchored two-dimensional palette |
| DatePicker | built | `DatePicker` |
| Form | deliberately absent | `Field` owns a11y wiring; form engines and state stay in the app (ADR 0011) |
| Input | built | `Input` and `Textarea` |
| InputNumber | built | `InputNumber` |
| Mentions | built | Textarea-owned single-trigger entity references with anchored injected suggestions |
| Radio | built | `RadioGroup` |
| Rate | built | `Rate` |
| Select | built | `Select` |
| Slider | built | Base UI single-value and two-thumb range selection with keyboard and pointer control |
| Switch | built | `Switch` |
| TimePicker | built | `TimePicker` |
| Transfer | built | Controlled or uncontrolled assignment between two persistent checkbox lists |
| TreeSelect | built | Anchored single-value hierarchy selection composed from `Tree` |
| Upload | built | `Upload` |

### Data Display

| Ant | Status | Ceebee coverage or intent |
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
| List | deliberately absent | Deprecated in Ant 6.6.1; tracked through `Listy` instead |
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

| Ant | Status | Ceebee coverage or intent |
|---|---|---|
| Alert | built | `Alert` |
| Drawer | built | `Drawer` |
| Message | replaced | `Toast`; component API rather than Ant's imperative API |
| Modal | built | `Modal`, composable `Modal.Confirm`, and `Modal.Skeleton`; anchored confirmation remains `Popconfirm` |
| Notification | built | Server-safe rich, longer-lived feedback with title and composable actions |
| Popconfirm | built | Anchored lightweight confirmation with composable actions; distinct from modal confirmation |
| Progress | replaced | `ProgressBar` and `ProgressRing` are separate contracts |
| Result | built | Server-safe end-state composition with semantic status tones and matching Skeleton |
| Skeleton | built | Shape atoms and mandatory `X.Skeleton` compositions |
| Spin | built | `Spin` |
| Watermark | built | Token-driven SVG text tiling over preserved child interactions, with matching Skeleton |

### Other

| Ant | Status | Ceebee coverage or intent |
|---|---|---|
| Affix | built | Native sticky layout within the nearest scroll container |
| App | deliberately absent | Consumers explicitly assemble the providers they use |
| BorderBeam | built | Client-bound decorative border with motion opt-out and reduced-motion rendering |
| ConfigProvider | replaced | `ThemeProvider`, `MotionProvider`, and `LabelsProvider` each own one job |
| Util | deliberately absent | React and Ceebee's exported prop types already provide type extraction |

## Pro Components family baseline

| Pro family | Includes | Status | Ceebee direction |
|---|---|---|---|
| ProLayout | `ProLayout`, `PageContainer` | recipe | `PageContainer`, shell primitives, and the ProLayout Recipe cover the reusable frame while routing, permissions, and navigation configuration stay app-owned |
| ProCard | `ProCard`, `StatisticCard`, `CheckCard` | recipe | `Card`, `Statistic`, and the ProCard Recipe cover layouts; CheckCard selection composes `RadioGroup` rather than duplicating its contract |
| ProForm | fields, lists, dependencies, schema forms, filters, step forms, modal/drawer forms, login forms | recipe | Recipes integrate an app-owned form engine with Ceebee `Field` and controls |
| ProTable | `ProTable`, `EditableProTable`, `DragSortTable` | recipe | `Table` stays presentational; the ProTable Recipe owns requests, filters, editing, and drag sorting |
| ProList | list, card-list, search, selection, expansion, and editing patterns | recipe | `Listy` is the base display contract; the ProList Recipe keeps request-driven workflows app-owned |
| ProDescriptions | configured, request-backed, and editable record details | recipe | `Descriptions` covers record display; the ProDescriptions Recipe owns request and edit flows |
| ProSkeleton | page-level skeletons | replaced | Every Composition owns `X.Skeleton`; Recipes compose those matching skeletons |
| ProField | schema-driven value display and editing | replaced | `Field`, inputs, and explicit renderers keep value semantics visible |

## Product-proven gaps

These are the strongest first delivery candidates because `ceebee-list` already implements them.

### Completed first delivery wave

1. **Card** — ships the full Ant-referenced family in one slice: cover, header/title/extra, body,
   actions, size, surface variant, hover treatment, loading, tabs, `Card.Meta`, `Card.Grid`, and
   `Card.Skeleton`; this establishes the anatomy reused by ProCard-style compositions. `Card` stays
   server-safe: its tabs region composes the existing client `Tabs`, which continues to own tab
   state and keyboard behaviour. `hoverable` changes elevation only; it never adds click handling,
   a role, or a tab stop to the non-interactive Card. Visual treatment uses Surface's
   `plain | tinted | glass | gradient` vocabulary plus `bordered`; Ant's outlined and borderless
   cases map to `bordered={true | false}`. Size follows Ceebee's `sm | md | lg` convention. The
   `actions` prop is a composable React node region rather than an array owned by Card. Both
   `loading` and direct `Card.Skeleton` usage render the same anatomy. The `title` region accepts a
   React node and never guesses a heading level; consumers provide the contextually correct heading.
   `Card.Grid` is a responsive grid container built on Ceebee's `Grid` contract rather than Ant's
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
interaction contract with a different delivery mechanism, so ADR 0014 currently points toward one
`Tooltip` API rather than another public component.

### Compared and closed

`PhotoStrip` is not a Carousel gap. It uses native scroll snap and keeps every slide mounted to
control image-request volume. It also owns Google attribution, URL-suffix sizing, and dead-photo
handling, all of which are product knowledge and stay in the app (ADR 0006).

## Taking an entry to built

Before implementation, record its role, keyboard and focus behaviour, state ownership, dismissal,
positioning, and gestures (ADR 0014). If those match an existing component, extend only the visual
or geometric surface; otherwise create a separate public contract.

The delivery slice then includes Tokens-only CSS, one side of the client boundary, Base UI behaviour
where applicable, reduced motion, an `X.Skeleton` for every Composition, focused tests, its own
`cb-` namespace, and a docs page in the same change.
