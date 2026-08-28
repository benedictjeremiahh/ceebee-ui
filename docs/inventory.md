# Component inventory

Every planned piece, its group (folder), its docs label (Atom / Composition), which entry it exports
from (server-safe `@ceebee/ui` vs `@ceebee/ui/client`), and which slice builds it.

Everything planned here is now built and documented. The slice column records the order it was
built in, which is worth keeping: it is the record of what turned out to be foundational.

What is *not* here — the gaps measured against the catalog baseline, and the pieces a product has
already had to write for itself — is in [roadmap.md](./roadmap.md).

## foundation

| Piece | Label | Entry | Slice | Notes |
|---|---|---|---|---|
| Tokens (structure) | — | css | S1 | spacing, radius, density, z, motion timing |
| Tokens (skin) | — | css | S1 | colour ramps, elevation, font; optional Astra, Clarity, and Moodboard Skins |
| Theme switching | — | css + client | S1 | `data-theme` + `prefers-color-scheme`; `ThemeProvider` only for the toggle |
| MotionProvider | Atom | client | S1 | global scale / kill switch, reduced-motion seam |
| Surface | Atom | server | S1 | `plain \| tinted \| glass \| gradient \| paper` × `tone` — carries material choices |
| Divider | Atom | server | built | legacy server-safe separator remains available |
| Stack / Grid / Container | Atom | server | built | legacy token-constrained layout primitives remain available |
| Layout | Composition | client | built | complete Header/Sider/Content/Footer frame from `@ceebee/ui/client` |
| Space (+ `.Compact`, `.Skeleton`) | Composition | server | built | legacy token-constrained Space and Skeleton remain available |
| Masonry (+ `.Skeleton`) | Composition | server | built | legacy Masonry and Skeleton remain available |
| Affix | Atom | server | built | native sticky positioning on semantic z rung |
| Splitter (+ `.Skeleton`) | Composition | client | built | legacy two-pane Splitter and Skeleton remain available |
| PageContainer (+ `.Skeleton`) | Composition | server | built | stateless page frame with injected regions |
| Text / Heading | Atom | server | built | legacy server-safe typography remains available; the complete typography surface is exported from `@ceebee/ui/client` |
| Icon | Atom | client | built | icons come from `@ant-design/icons`, themed through `ThemeProvider` |

## form

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Button | Atom | server | S1 — built |
| FloatButton (+ `.Group`, `.BackTop`) | Composition | client | built |

The rest of this section was removed: every field component it held now ships from `@ceebee/ui/client`, and `Form.Item`
replaced the `Field` wiring they shared.

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
| Result (+ `.Skeleton`) | Composition | server | built |
| Notification (+ `.Skeleton`) | Composition | server | built |
| Watermark (+ `.Skeleton`) | Composition | client | built |

## overlay

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Modal (+ `.Confirm`, `.Skeleton`) | Composition | client | S1 — built |
| Drawer | Composition | client | S1 — built |
| Popover | Atom | client | S2 — built |
| Tooltip | Atom | client | S2 — built |
| Popconfirm (+ `.Skeleton`) | Composition | client | built |
| Dropdown | Composition | client | built |
| CommandPalette | Composition | client | S4 — built |

## data

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Card (+ `.Meta`, `.Grid`, `.Skeleton`) | Composition | server | built |
| Collapse (+ `.Skeleton`) | Composition | client | built |
| Descriptions (+ `.Item`, `.Skeleton`) | Composition | server | built |
| Calendar (+ `.Skeleton`) | Composition | client | built |
| QRCode | Atom | server | built |
| Tree (+ `.Skeleton`) | Composition | client | built |
| Listy (+ `.Skeleton`) | Composition | server | built |
| Statistic (+ `.Skeleton`) | Composition | server | S1 |
| Donut | Widget | server | S2 — built |
| Sparkline / BarMini | Widget | server | S2 — built |
| Table (+ `.Skeleton`) | Composition | client | S3 — built |
| Leaderboard (+ `.Skeleton`) | Composition | server | S3 — built |
| Timeline (+ `.Skeleton`) | Composition | server | S4 — built |
| StickerGroup (+ `.Skeleton`) | Composition | client | built — controlled removal with settle, peel, and layout motion |

## nav

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Tabs | Composition | client | built |
| Menu (+ `.Skeleton`) | Composition | client | built |
| Sidebar / TopBar | Composition | client | S3 — built |
| Breadcrumb | Atom | server | built |
| Anchor (+ `.Skeleton`) | Composition | server | built |
| LinkButton | Atom | server | S5 — built |
| Pagination | Composition | client | built |
| Steps | Composition | client | built |

## media

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Carousel (Embla + Motion, `.Skeleton`) | Composition | client | S2 — built |
| Avatar / AvatarGroup | Atom | server | S2 — built |
| Image with blur-up (+ `.PreviewGroup`, both Skeletons) | Composition | client | S4 — built |

## motion

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Motion tokens + presets | — | css | S1 |
| Reveal / Stagger | Atom | client | S2 — built |
| BorderBeam | Atom | client | built |
| AnimatePresence wrappers (enter/exit) | Atom | client | S2 |
| ScrollReveal | Composition | client | dropped — `Reveal`/`Stagger` take `onView`, which is the same thing with one fewer component |

## onboarding

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Checklist | Composition | client | S4 — built |

## Recipes (docs only, never shipped)

| Recipe | Source pin | Slice |
|---|---|---|
| Astra dashboard — sidebar, greeting, 84% ring, project line, task lists | board | S1 |
| Glass control center — notification panels | board | S3 — built |
| Gamified mobile — progress rings, streaks, leaderboard | board | S3 — built |
| Fintech mobile — balance card, split bill, transactions | board | S4 — built |
