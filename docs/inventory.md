# Component inventory

Every planned piece, its group (folder), its docs label (Atom / Composition), which entry it exports
from (server-safe `@ceebee/ui` vs `@ceebee/ui/client`), and which slice builds it.

`S1` = the tracer bullet: tokens, theme, build, docs site, release, proven end to end on a narrow
path — **built**. `S2`+ = mechanical additions afterwards, still to do.

## foundation

| Piece | Label | Entry | Slice | Notes |
|---|---|---|---|---|
| Tokens (structure) | — | css | S1 | spacing, radius, density, z, motion timing |
| Tokens (skin) | — | css | S1 | colour ramps, elevation, font; `skins/astra.css` reproduces the board |
| Theme switching | — | css + client | S1 | `data-theme` + `prefers-color-scheme`; `ThemeProvider` only for the toggle |
| MotionProvider | Atom | client | S1 | global scale / kill switch, reduced-motion seam |
| Surface | Atom | server | S1 | `plain \| tinted \| glass \| gradient` × `tone` — carries the board look |
| Stack / Grid / Container | Atom | server | S1 | layout only |
| Text / Heading | Atom | server | S1 | type scale from tokens |

## form

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Field (label + hint + error wiring) | Atom | client | S1 |
| Button | Atom | client | S1 |
| TextInput / Textarea | Atom | client | S1 |
| Select | Atom | client | S2 |
| Checkbox / Radio / Switch | Atom | client | S2 |
| NumberInput | Atom | client | S2 |
| DateInput | Atom | client | S3 |
| Combobox / Autocomplete | Composition | client | S3 |
| FileDrop | Composition | client | S4 |

## feedback

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Skeleton (`.Text` `.Circle` `.Rect`) | Atom | server | S1 |
| Spinner / ProgressBar | Atom | server | S2 |
| Badge / Tag | Atom | server | S2 |
| Alert / Callout | Composition | server | S2 |
| Toast | Composition | client | S3 |
| EmptyState | Composition | server | S3 |

## overlay

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Dialog / Drawer | Composition | client | S1 |
| Popover | Atom | client | S2 — built |
| Tooltip | Atom | client | S2 — built |
| DropdownMenu | Composition | client | S3 |
| CommandPalette | Composition | client | S4 |

## data

| Piece | Label | Entry | Slice |
|---|---|---|---|
| StatCard (+ `.Skeleton`) | Composition | server | S1 |
| ProgressRing | Widget | server | S1 |
| Donut | Widget | server | S2 |
| Sparkline / BarMini | Widget | server | S2 |
| DataTable (+ `.Skeleton`) | Composition | client | S3 |
| Leaderboard | Composition | server | S3 |
| Timeline | Composition | server | S4 |

## nav

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Tabs | Composition | client | S2 |
| Sidebar / TopBar | Composition | client | S3 |
| Breadcrumbs / Pagination | Composition | server | S3 |
| Stepper | Composition | client | S4 |

## media

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Carousel (Embla + Motion, `.Skeleton`) | Composition | client | S2 — built |
| Avatar / AvatarGroup | Atom | server | S2 |
| Image with blur-up | Composition | client | S4 |

## motion

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Motion tokens + presets | — | css | S1 |
| Reveal / Stagger | Atom | client | S2 — built |
| AnimatePresence wrappers (enter/exit) | Atom | client | S2 |
| ScrollReveal | Composition | client | S4 |

## onboarding

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Coachmark (bubble + spotlight) | Composition | client | S2 — built |
| Tour (sequencing controller) | Composition | client | S2 — built |
| Seen Store interface | — | client | S2 — built |
| Checklist / GettingStarted | Composition | client | S4 |

## Recipes (docs only, never shipped)

| Recipe | Source pin | Slice |
|---|---|---|
| Astra dashboard — sidebar, greeting, 84% ring, project line, task lists | board | S1 |
| Glass control center — notification panels | board | S3 |
| Gamified mobile — progress rings, streaks, leaderboard | board | S3 |
| Fintech mobile — balance card, split bill, transactions | board | S4 |
