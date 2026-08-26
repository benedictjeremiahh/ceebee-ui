# Component inventory

Every planned piece, its group (folder), its docs label (Atom / Composition), which entry it exports
from (server-safe `@ceebee/ui` vs `@ceebee/ui/client`), and which slice builds it.

Everything planned here is now built and documented. The slice column records the order it was
built in, which is worth keeping: it is the record of what turned out to be foundational.

What is *not* here — the gaps measured against Ant Design's breadth, and the pieces a product has
already had to write for itself — is in [roadmap.md](./roadmap.md).

## foundation

| Piece | Label | Entry | Slice | Notes |
|---|---|---|---|---|
| Tokens (structure) | — | css | S1 | spacing, radius, density, z, motion timing |
| Tokens (skin) | — | css | S1 | colour ramps, elevation, font; `skins/astra.css` reproduces the board |
| Theme switching | — | css + client | S1 | `data-theme` + `prefers-color-scheme`; `ThemeProvider` only for the toggle |
| MotionProvider | Atom | client | S1 | global scale / kill switch, reduced-motion seam |
| Surface | Atom | server | S1 | `plain \| tinted \| glass \| gradient` × `tone` — carries the board look |
| Divider | Atom | server | S5 — built | a bare `<hr>`, or `role="separator"` when it carries a label |
| Stack / Grid / Container | Atom | server | S1 | layout only |
| Space (+ `.Compact`, `.Skeleton`) | Composition | server | Ant coverage wave 2 — built | sibling spacing, separators, and adjacent-control geometry |
| Masonry (+ `.Skeleton`) | Composition | server | Ant coverage wave 3 — built | ragged, responsive columns |
| Affix | Atom | server | Ant coverage wave 3 — built | native sticky positioning on semantic z rung |
| Splitter (+ `.Skeleton`) | Composition | client | Ant coverage wave 4 — built | pointer and keyboard pane resizing |
| PageContainer (+ `.Skeleton`) | Composition | server | Pro Components coverage — built | stateless page frame with injected regions |
| Text / Heading | Atom | server | S1 | type scale from tokens |

## form

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Field (label + hint + error wiring) | Atom | client | S1 |
| Button | Atom | client | S1 |
| FloatButton | Atom | client | Ant coverage wave 4 — built |
| Input / Textarea | Atom | client | S1 |
| Select | Atom | client | S2 — built |
| Checkbox / Radio / Switch | Atom | client | S2 — built |
| Rate | Atom | client | S5 — built |
| InputNumber | Atom | client | S2 — built |
| Slider (+ `.Skeleton`) | Composition | client | Ant coverage wave 5 — built |
| Mentions (+ `.Skeleton`) | Composition | client | Ant coverage wave 6 — built |
| Transfer (+ `.Skeleton`) | Composition | client | Ant coverage wave 6 — built |
| TreeSelect (+ `.Skeleton`) | Composition | client | Ant coverage wave 7 — built |
| Cascader (+ `.Skeleton`) | Composition | client | Ant coverage wave 7 — built |
| ColorPicker (+ `.Skeleton`) | Composition | client | Ant coverage wave 7 — built |
| DatePicker | Composition | client | S3 — built |
| TimePicker | Composition | client | S5 — built |
| AutoComplete | Atom | client | S3 — built |
| Upload | Composition | client | S4 — built |

## feedback

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Skeleton (`.Text` `.Circle` `.Rect`) | Atom | server | S1 |
| Spin / ProgressBar | Atom | server | S3 — built |
| Badge | Atom | server | S2 — built |
| Tag | Atom | client | S5 — built |
| Alert / Callout | Composition | client | S2 — built |
| Toast | Composition | client | S3 — built |
| Empty | Composition | server | S3 — built |
| Result (+ `.Skeleton`) | Composition | server | Ant coverage wave 2 — built |
| Notification (+ `.Skeleton`) | Composition | server | Ant coverage wave 5 — built |
| Watermark (+ `.Skeleton`) | Composition | client | Ant coverage wave 3 — built |

## overlay

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Modal (+ `.Confirm`, `.Skeleton`) | Composition | client | S1 / Ant coverage wave 1 — built |
| Drawer | Composition | client | S1 — built |
| Popover | Atom | client | S2 — built |
| Tooltip | Atom | client | S2 — built |
| Popconfirm (+ `.Skeleton`) | Composition | client | Ant coverage wave 5 — built |
| Dropdown | Composition | client | S3 — built |
| CommandPalette | Composition | client | S4 — built |

## data

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Card (+ `.Meta`, `.Grid`, `.Skeleton`) | Composition | server | Ant coverage wave 1 — built |
| Collapse (+ `.Skeleton`) | Composition | client | Ant coverage wave 1 — built |
| Descriptions (+ `.Item`, `.Skeleton`) | Composition | server | Ant coverage wave 2 — built |
| Calendar (+ `.Skeleton`) | Composition | client | Ant coverage wave 5 — built |
| QRCode | Atom | server | Ant coverage wave 6 — built |
| Tree (+ `.Skeleton`) | Composition | client | Ant coverage wave 6 — built |
| Listy (+ `.Skeleton`) | Composition | server | Ant coverage wave 7 — built |
| Statistic (+ `.Skeleton`) | Composition | server | S1 |
| ProgressRing | Widget | server | S1 |
| Donut | Widget | server | S2 — built |
| Sparkline / BarMini | Widget | server | S2 — built |
| Table (+ `.Skeleton`) | Composition | client | S3 — built |
| Leaderboard (+ `.Skeleton`) | Composition | server | S3 — built |
| Timeline (+ `.Skeleton`) | Composition | server | S4 — built |

## nav

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Tabs | Composition | client | S2 — built |
| Menu (+ `.Skeleton`) | Composition | client | Ant coverage wave 5 — built |
| Sidebar / TopBar | Composition | client | S3 — built |
| Breadcrumb | Atom | server | S3 — built |
| Anchor (+ `.Skeleton`) | Composition | server | Ant coverage wave 4 — built |
| LinkButton | Atom | server | S5 — built |
| Pagination | Composition | client | S3 — built |
| Steps | Composition | server | S4 — built |

## media

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Carousel (Embla + Motion, `.Skeleton`) | Composition | client | S2 — built |
| Avatar / AvatarGroup | Atom | server | S2 — built |
| Image with blur-up (+ `.PreviewGroup`, both Skeletons) | Composition | client | S4 / Ant coverage wave 1 — built |

## motion

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Motion tokens + presets | — | css | S1 |
| Reveal / Stagger | Atom | client | S2 — built |
| BorderBeam | Atom | client | Ant coverage wave 3 — built |
| AnimatePresence wrappers (enter/exit) | Atom | client | S2 |
| ScrollReveal | Composition | client | dropped — `Reveal`/`Stagger` take `onView`, which is the same thing with one fewer component |

## onboarding

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Coachmark (bubble + spotlight) | Composition | client | S2 — built |
| Tour (sequencing controller) | Composition | client | S2 — built |
| Seen Store interface | — | client | S2 — built |
| Checklist | Composition | client | S4 — built |

## Recipes (docs only, never shipped)

| Recipe | Source pin | Slice |
|---|---|---|
| Astra dashboard — sidebar, greeting, 84% ring, project line, task lists | board | S1 |
| Glass control center — notification panels | board | S3 — built |
| Gamified mobile — progress rings, streaks, leaderboard | board | S3 — built |
| Fintech mobile — balance card, split bill, transactions | board | S4 — built |
| ProLayout mapping — shell/page frame with app-owned routing | Ant Pro Components | built |
| ProCard mapping — Card and Statistic compositions | Ant Pro Components | built |
| ProForm mapping — app-owned form engine with Ceebee fields | Ant Pro Components | built |
| ProTable mapping — requests/editing/drag workflows around Table | Ant Pro Components | built |
| ProList mapping — search/selection/edit workflows around Listy | Ant Pro Components | built |
| ProDescriptions mapping — request/edit workflows around Descriptions | Ant Pro Components | built |
