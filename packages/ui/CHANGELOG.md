# @ceebee/ui

## 0.3.2

### Patch Changes

- Increase regular-glass backdrop diffusion while preserving enough translucency for the frosted effect to remain visible.

## 0.3.1

### Patch Changes

- Increase regular glass density across the default, Astra, and Clarity skins so navigation, toolbars,
  and text-bearing overlays retain separation and legibility over content. Clear glass remains the
  high-translucency option for compact controls over media.

## 0.3.0

### Minor Changes

- 8b926fb: Add regular and clear glass materials to `Surface`, plus the content-first Clarity skin and its
  adaptive accessibility fallbacks.

## 0.2.1

### Patch Changes

- Mark Lucide and Embla as required runtime peers so a clean package installation can resolve both
  public entry points without consumers manually repairing the dependency graph.

## 0.2.0

### Minor Changes

- 28fbb10: Carousel on Embla, with autoplay that stops for the pointer, for focus, for a background tab, and
  for reduced motion — plus `Carousel.Skeleton` sharing the real track geometry. Coachmark (anchored
  bubble with a spotlight that tracks its target through scroll and resize) and Tour (step
  sequencing, with memory injected through a `SeenStore` the app owns). Popover and Tooltip on Base
  UI, and the `Reveal` / `Stagger` motion primitives.
- cc59ad4: Badge, Alert, EmptyState, Toast, Tabs, Avatar with AvatarGroup, Donut, Sparkline, and BarMini.

  Alert distinguishes what interrupts from what waits: danger and warning are assertive alerts, the
  quieter tones are polite status messages. Toast ships its own viewport with the provider, and an
  error toast has no timeout. Avatar is server-safe — initials render underneath the image, so a
  broken photo URL degrades without JavaScript, and the fallback colour is derived from the name so
  a person keeps their colour everywhere.

  The widget arithmetic is pure and tested: donut arcs drop values that cannot be drawn instead of
  drawing them backwards, and a sparkline puts a flat series on the middle line rather than
  collapsing it onto the floor.

- cbc4350: Completes the form controls: Select (a themed listbox on Base UI, not a native `<select>`),
  Checkbox with an indeterminate state, RadioGroup with per-option descriptions, Switch with a
  settings-row layout, and NumberInput whose arithmetic — parsing a comma decimal, clamping on blur
  rather than on keystroke, stepping without floating-point crumbs, and treating an empty field as
  `null` — is a pure module with its own tests.

  Every control takes its label, description wiring, and error state from `Field`, and every
  callback now receives the value alone: Base UI's second argument no longer leaks through
  `Checkbox` and `Switch`.

- cb485db: First slice: structure and skin tokens with CSS-first theming, the Astra skin, Surface with
  plain/tinted/glass/gradient variants, Stack/Grid/Container, Text/Heading, Skeleton with shape
  atoms, ProgressRing, StatCard with its own Skeleton, Button, Field with TextInput and Textarea,
  Dialog on Base UI, and the ThemeProvider and MotionProvider seams. Server-safe primitives ship
  from the package root; everything interactive from `@ceebee/ui/client`.
- e4f477a: Closes the gaps the audit listed.

  `LabelsProvider` puts every string the library says out loud in one place — carousel and pagination
  controls, date and time triggers, file drop copy, stepper arrows, the shell's collapse button, and
  the Tour's buttons. Override only what you translate; the rest fall back to English. A Tour's own
  `labels` prop still wins, because one tour may speak differently from the product around it.

  Sidebar items take `items` for one level of children: expanded they are a disclosure with an
  indent rail, and collapsed the rail's hover flyout carries the label and the whole submenu, so a
  collapsed sidebar is readable rather than a column of guesses.

  Also: `Leaderboard.Skeleton` and `Timeline.Skeleton`, a `truncate` flag per table column,
  `ToastProvider position` (six logical placements, with a top stack entering from above), and
  `prefers-contrast: more` support in the tokens. Accessibility is now checked by axe in the test
  suite, across form controls, data display, navigation and feedback.

- a5151f5: Combobox, DateInput with its own calendar, FileDrop, CommandPalette, Spinner, ProgressBar,
  Timeline, and the onboarding Checklist.

  The date parser reads ISO and day-first input, expands a two-digit year, and refuses 31 February
  rather than rolling it into March; the calendar grid is always six weeks so the popover never
  changes height. FileDrop reports every rejection with a reason instead of dropping files silently,
  and keeps a real file input underneath the drop zone. The palette ranks an exact label above a
  prefix, a word start, a substring, and finally a keyword — so "logout" finds "Sign out" — and ties
  keep the caller's order.

  `ScrollReveal` is dropped from the plan: `Reveal` and `Stagger` already take `onView`, which is the
  same feature with one fewer component to maintain.

- fa6151d: Leaderboard and a blur-up Image, which completes the planned inventory.

  Leaderboard is an ordered list with an optional medal tint on the top three and a marker for the
  viewer's own row. Image reserves its space through `aspectRatio` and fades in over a blurred
  placeholder — and it checks `complete` on the ref, because a cached image can finish loading
  before React attaches `onLoad`, which is the bug that leaves the frame permanently blank.

- f0805b4: DataTable with sortable headers and its own Skeleton, Pagination, DropdownMenu, Breadcrumbs,
  Stepper, and the Sidebar and TopBar shell.

  Sorting cycles through three states, so there is a way back to the order the server gave, and the
  state lives on the header as `aria-sort` rather than only in the arrow. The page list keeps the
  first and last page reachable and spells out a single skipped page instead of hiding it behind an
  ellipsis of the same width. A collapsed Sidebar keeps every label in its accessible name, and the
  last breadcrumb is text with `aria-current` rather than a link to the page you are already on.

- 8ece16c: Adds `TimeInput`, and fixes a run of defects found by reading the running site.

  The Coachmark bubble was painted **under** its own spotlight: the z-index sat on a
  `position: static` popup, where it does nothing, while the spotlight's own layer stacked above it.
  It now lives on the positioner Base UI portals.

  Combobox handed Base UI a bare string where it expects whole items, so the field displayed the id
  ("id" instead of "Indonesia") and selection returned an object the caller could not use. The
  mapping now happens inside the component, and its options have an even rhythm whether or not they
  carry a description line.

  Disabled controls were only dimmed, which reads as nothing at a glance. A disabled checkbox, radio
  or switch now loses its fill and takes a dashed edge, and disabled menu, select and tab items are
  struck through.

  Also: clicking a DateInput field opens its calendar rather than only the trailing button, the
  FileDrop zone is a single label so the picker opens exactly once from anywhere in it, and a Toast
  with an action lays its button out on its own row instead of squeezing it beside the text.

  Dark mode was hard to read: panel edges measured 1.37:1 against their surface where WCAG asks 3:1
  of a control boundary, and the two page greys were 1.09:1 apart. The ramp is re-spread — control
  edges now measure 3.45:1 in dark and 3.0:1 in light.

### Patch Changes

- 99b9f52: Refine the glass Surface into a layered, skin-tunable material with composed elevation and opaque,
  high-contrast, reduced-transparency, and forced-colour fallbacks.
- acbcb1e: Fixes a click hijack introduced by the hit-target work: `.cb-switch::before` carried the 24px
  pointer target, but the switch establishes no containing block, so the pseudo-element grew to the
  width of a distant ancestor and swallowed clicks across the page — on the Button docs page, every
  click toggled the loading switch. The switch never needed it (it is already 40×24), and the rule
  now applies only to checkbox and radio, which are positioned.

  A test locks the invariant: any absolutely positioned, percentage-sized pseudo-element must sit on
  a host that is itself positioned. It is checked in the CSS because jsdom has no layout to measure.

- fa9a858: The Toast action is a soft button rather than bare text. Unstyled at rest, its padding read as
  uneven space beside the title, and only a hover explained where the control began.
- cf618fa: Tidy-up pass over the whole surface.

  The Switch was built from hand-tuned numbers and its thumb sat off-centre; its geometry is now
  derived from the track's own dimensions, so the insets are equal on all four sides. NumberInput's
  value was centred between two steppers while every other control's text starts at the same left
  edge — the steppers moved to the trailing edge and the value lines up with the rest of a form.

  Colour and focus rings are fully tokenised: the dialog scrim, the coachmark spotlight, and the
  warning button's foreground were literal `oklch()` values, and five different `outline-offset`
  numbers are now two tokens (`--cb-focus-offset` and `--cb-focus-offset-inset`).

  The neutral text ramp failed WCAG AA in light mode — hint and description text measured 2.89:1
  against its surface. Muted and subtle are re-spread and now measure 7.16:1 and 4.70:1 in light,
  9.25:1 and 5.41:1 in dark. List items and `<kbd>` elements the library renders gained margin
  resets, so a host app's typography can no longer inflate them, and the Donut now honours reduced
  motion like the ProgressRing already did.

- c4e2aac: UI/UX audit pass.

  Icon-only Buttons are square: with no children they drop the text padding, the gap and the empty
  label span, so a row-action button is a 40px square with its glyph centred instead of a wide
  control with an off-centre icon. DataTable is denser — header and cells at the smaller spacing
  step, a fixed 3rem row height, the table's own gutter on the first and last cell, and no text
  padding around a cell that holds only a control.

  Accessibility: checkbox, radio and switch now present a 24×24 pointer target (WCAG 2.5.8) while
  the visual box stays 18px, and a table's sort control fills its header cell rather than being a
  14px-tall target. The coachmark and popover tail is a clipped rotated square carrying the popup's
  own border, which joins the edge exactly — the hand-drawn SVG never did. Dialog placement uses
  logical properties, so the corner variant follows the writing direction.
