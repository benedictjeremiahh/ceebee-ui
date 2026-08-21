# Component inventory

Every planned piece, its group (folder), its docs label (Atom / Composition), which entry it exports
from (server-safe `@ceebee/ui` vs `@ceebee/ui/client`), and which slice builds it.

Everything planned here is now built and documented. The slice column records the order it was
built in, which is worth keeping: it is the record of what turned out to be foundational.

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
| Select | Atom | client | S2 — built |
| Checkbox / Radio / Switch | Atom | client | S2 — built |
| NumberInput | Atom | client | S2 — built |
| DateInput | Composition | client | S3 — built |
| TimeInput | Composition | client | S5 — built |
| Combobox | Atom | client | S3 — built |
| FileDrop | Composition | client | S4 — built |

## feedback

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Skeleton (`.Text` `.Circle` `.Rect`) | Atom | server | S1 |
| Spinner / ProgressBar | Atom | server | S3 — built |
| Badge / Tag | Atom | server | S2 — built |
| Alert / Callout | Composition | client | S2 — built |
| Toast | Composition | client | S3 — built |
| EmptyState | Composition | server | S3 — built |

## overlay

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Dialog / Drawer | Composition | client | S1 |
| Popover | Atom | client | S2 — built |
| Tooltip | Atom | client | S2 — built |
| DropdownMenu | Composition | client | S3 — built |
| CommandPalette | Composition | client | S4 — built |

## data

| Piece | Label | Entry | Slice |
|---|---|---|---|
| StatCard (+ `.Skeleton`) | Composition | server | S1 |
| ProgressRing | Widget | server | S1 |
| Donut | Widget | server | S2 — built |
| Sparkline / BarMini | Widget | server | S2 — built |
| DataTable (+ `.Skeleton`) | Composition | client | S3 — built |
| Leaderboard (+ `.Skeleton`) | Composition | server | S3 — built |
| Timeline (+ `.Skeleton`) | Composition | server | S4 — built |

## nav

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Tabs | Composition | client | S2 — built |
| Sidebar / TopBar | Composition | client | S3 — built |
| Breadcrumbs | Atom | server | S3 — built |
| Pagination | Composition | client | S3 — built |
| Stepper | Composition | server | S4 — built |

## media

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Carousel (Embla + Motion, `.Skeleton`) | Composition | client | S2 — built |
| Avatar / AvatarGroup | Atom | server | S2 — built |
| Image with blur-up | Composition | client | S4 — built |

## motion

| Piece | Label | Entry | Slice |
|---|---|---|---|
| Motion tokens + presets | — | css | S1 |
| Reveal / Stagger | Atom | client | S2 — built |
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
