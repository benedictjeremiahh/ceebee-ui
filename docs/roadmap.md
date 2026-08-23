# What the library does not have yet

[`inventory.md`](./inventory.md) records what is built. This records what is not, measured against
[Ant Design's component overview](https://ant.design/components/overview) — the breadth we are
aiming at — and against the products already built on this library.

Two sources feed it. The first is that comparison. The second is the pieces cee-bee-list has had to
write for itself: a component a product invents is either genuinely product-specific or a gap in
the library, and the difference is worth deciding rather than drifting into.

Nothing here is scheduled. It is a list of decisions not yet taken, each with enough of a reference
to judge it by.

## Deliberately absent

These have Ant equivalents and will not be built. Recording them stops the same question being
asked twice.

| Ant | Why not |
|---|---|
| [Form](https://ant.design/components/form) | The library owns `Field` and refuses to own forms — no validation engine, no form state (ADR 0011) |
| [Icon](https://ant.design/components/icon) | Consumers pass their own; the library imports `lucide-react` and does not re-export an icon set |
| [ConfigProvider](https://ant.design/components/config-provider) | Split on purpose into `ThemeProvider`, `MotionProvider` and `LabelsProvider`, each with one job |
| [App](https://ant.design/components/app) | A composition of providers a consumer assembles; wrapping it would hide which ones it has |

## Already covered

Since ADR 0016 most of these share Ant's name outright; the rows that remain are the ones where a
rename was the wrong tool. Listed so the gap list below is honest about its size.

| Ant | Here |
|---|---|
| [AutoComplete](https://ant.design/components/auto-complete) | `AutoComplete`, including `loadItems` for a list that lives behind a query |
| [Segmented](https://ant.design/components/segmented) | `RadioGroup variant="segmented"` — same contract, different drawing (ADR 0014) |
| [Modal](https://ant.design/components/modal) | `Modal` |
| [Message](https://ant.design/components/message) | `Toast` |
| [Steps](https://ant.design/components/steps) | `Steps` |
| [Statistic](https://ant.design/components/statistic) | `Statistic` |
| [Table](https://ant.design/components/table) | `Table` |
| [Empty](https://ant.design/components/empty) | `Empty` |
| [Spin](https://ant.design/components/spin) | `Spin` |
| [Upload](https://ant.design/components/upload) | `Upload` |
| [Space](https://ant.design/components/space) / [Flex](https://ant.design/components/flex) | `Flex` |
| [Layout](https://ant.design/components/layout) | `Sidebar` + `TopBar` |
| [Dropdown](https://ant.design/components/dropdown) | `Dropdown` |
| [Tag](https://ant.design/components/tag) | `Tag` — Badge's interactive sibling |
| [Rate](https://ant.design/components/rate) | `Rate` |
| [Divider](https://ant.design/components/divider) | `Divider` |

## Gaps a product has already had to fill

The strongest candidates: cee-bee-list wrote each of these because the library had nothing, so the
cost of not having them is already known.

| Piece | Ant reference | What it is | Where it exists today |
|---|---|---|---|
| **Collapse** | [Collapse](https://ant.design/components/collapse) | A row that opens into an editor or detail, one at a time | Hand-rolled in `PinsSheet` and `BulkLogSheet`, each with its own chevron and `aria-expanded` |
| **ConfirmModal** | [Modal.confirm](https://ant.design/components/modal) | A destructive question that names what is about to be lost. Ant's shape is `Modal.confirm`, not [Popconfirm](https://ant.design/components/popconfirm) — this asks in a modal, not a popover | `components/ConfirmSheet.tsx` |
| **Image preview** | [Image.PreviewGroup](https://ant.design/components/image) | Full-screen viewer: zoom, swipe, next/previous, restore focus | `components/Lightbox.js` — 260 lines of it |
| **Card** | [Card](https://ant.design/components/card) | `Surface` plus the header/body/actions arrangement every product rebuilds | `.card`, `.card-body`, `.card-actions` |

### Worth a decision rather than a build

**A tooltip layer.** `Tooltip` wraps one trigger. cee-bee-list needed the opposite: one listener on
the document and elements opting in with an attribute, because its tips sit on rows that clip and
stack, and because `title` does not exist on a phone. That is the same interaction contract as
`Tooltip` delivered differently — so under ADR 0014 it is not a second component, and the question
is whether `Tooltip` should grow a layer mode or stay per-trigger. See `components/TooltipLayer.js`.

**PhotoStrip — compared, and not a gap.** `Carousel` is embla-backed with slide widths, arrows and
dots; `PhotoStrip` is native CSS scroll-snap with every slide mounted, measured at 21 image requests
for a 119-card list rather than 595. It also carries three things a library component must not
(ADR 0006): Google's photographer-credit requirement, the `=w360-h216-c` URL-suffix sizing contract,
and dropping a dead photo on `onerror`. Closed.

## Gaps with no product asking yet

Ordered by how often a product tends to want them. Nothing here is justified by a real need in a
product built on the library, which is exactly why none of it is scheduled.

| Ant | What it is |
|---|---|
| [Slider](https://ant.design/components/slider) | Choosing a number, or a range, by dragging |
| [Result](https://ant.design/components/result) | The end of a flow: succeeded, failed, not found |
| [Descriptions](https://ant.design/components/descriptions) | Label-and-value pairs in a grid, for a record's detail view |
| [Notification](https://ant.design/components/notification) | A richer, longer-lived Toast with a title and actions |
| [Tree](https://ant.design/components/tree) / [TreeSelect](https://ant.design/components/tree-select) | Hierarchies, and choosing from one |
| [Cascader](https://ant.design/components/cascader) | Choosing down a chain — country, then city, then district |
| [Transfer](https://ant.design/components/transfer) | Moving items between two lists |
| [Calendar](https://ant.design/components/calendar) | A month grid with content on the days, not a date field |
| [ColorPicker](https://ant.design/components/color-picker) | Choosing a colour |
| [Mentions](https://ant.design/components/mentions) | Typing `@` to reference someone |
| [FloatButton](https://ant.design/components/float-button) | A persistent action floating over the page |
| [Affix](https://ant.design/components/affix) / [Anchor](https://ant.design/components/anchor) | Pinning a control while scrolling; jumping to a section |
| [QRCode](https://ant.design/components/qr-code) | Rendering a QR code |
| [Watermark](https://ant.design/components/watermark) | A repeating mark over content |
| [Splitter](https://ant.design/components/splitter) / [Masonry](https://ant.design/components/masonry) | Resizable panes; a ragged column layout |

## How to take one off this list

The same contract every other piece was built to (`AGENTS.md`): tokens only, one side of the client
boundary, behaviour from Base UI, a `Skeleton` if it is a Composition, a reduced-motion rendering, a
`cb-` namespace of its own, a spec that tests what can be wrong, and a docs page in the same change.

And before any of it, the boundary check from ADR 0014: write down the role, keyboard and focus
behaviour, state model, dismissal, positioning and gestures. If they match something that exists,
extend it with visual or geometric props instead.
