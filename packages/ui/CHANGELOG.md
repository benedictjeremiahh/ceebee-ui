# @ceebee/ui

## 1.4.0

### Minor Changes

- 42ff03f: Ant's primitives now paint from Ceebee Tokens before Ant's own JavaScript-generated CSS arrives.

  A server-rendered document carries Ant's class names and none of its rules, so buttons, inputs, selects, and segmented controls painted as native browser controls until hydration — a square grey button on a Ceebee surface, in both colour modes. `styles.css` now carries a pre-paint layer for those classes, authored from Tokens and wrapped entirely in `:where()` so it has no specificity and every real Ant rule overrides it the moment it lands. It reads Ant's own server-rendered variant and size classes, so a text button does not borrow a surface for the length of the first paint.

  Consumers get this by importing `@ceebee/ui/styles.css` as before; nothing to configure. Note that server-extracting Ant's rules with `@ant-design/nextjs-registry` is still not recommended — Ant's seed comes from live CSS Tokens, which a server cannot read, so extracted rules carry Ant's default light palette. See `docs/adr/0022-ceebee-paints-ant-primitives-before-ant-does.md`.

  `CommandPalette`'s search input no longer picks up a consumer's global `:focus-visible` outline. The stylesheet already declared `outline: none` on it, but a bare `:focus-visible` rule ties on specificity and wins on import order, drawing a hard box around a deliberately borderless field. The rule is now stated against `:focus-visible` so it holds, and the search row takes the brand colour on focus so the indicator is not simply removed.

## 1.3.3

### Patch Changes

- 08910a8: Give each sticker an angle that belongs to it. Deriving the tilt from the array index meant dismissing one sticker re-tilted every sticker after it, so the collection appeared to rearrange itself in response to a dismissal it had nothing to do with.

## 1.3.2

### Patch Changes

- f03bba4: Take placeholder text to the muted foreground. The subtle foreground only cleared WCAG AA against the plain surface, so a control on any tinted or paper surface fell short.

## 1.3.1

### Patch Changes

- 90592cd: Read Skin tokens on the first client render instead of in an effect, so a themed page no longer flashes Ant's own default palette before the Skin arrives.

## 1.3.0

### Minor Changes

- 6cde75f: Add `--cb-fg-link` for brand-coloured text on a surface, and send Ant a placeholder colour. Ant derived its own 25%-alpha placeholder grey, which failed WCAG AA text contrast in both modes.

## 1.2.0

### Minor Changes

- c40e26f: Add PanZoomCanvas with pointer, pinch, wheel, keyboard, reduced-motion, and skeleton contracts.

## 1.1.1

### Patch Changes

- Ship the cross-platform token bridge on top of the Moodboard release line.

## 1.1.0

### Minor Changes

- e99f451: Add the Moodboard Skin, the taped-paper Surface variant, and the controlled StickerGroup
  composition with settle-in, peel-away, reduced-motion, and matching Skeleton states.

## 1.0.2

### Patch Changes

- Add cross-platform token sources and strengthen accessibility token cascading for the Flutter package bridge.

## 1.0.1

### Patch Changes

- faeec46: Fix `@ceebee/ui/client` failing to load outside a bundler.

  The four locale re-exports used extensionless subpaths. The package they come from ships no
  `exports` map, so those resolve only under a bundler's resolution — under plain Node ESM they throw
  `ERR_MODULE_NOT_FOUND` and take the whole entry with them. That reaches anything importing the
  client entry outside a bundler: a Vitest suite in the node environment, a script, or a Next app that
  lists `@ceebee/ui` in `serverExternalPackages`.

  They now point at the CommonJS files, which Node ESM loads through interop and a bundler resolves
  just the same.

  Also dropped `embla-carousel-react` from `peerDependencies`. Nothing has imported it since the
  carousel source port was removed, so it was asking consumers to install an engine the package does
  not use.

## 1.0.0

### Major Changes

- 55b36f3: **1.0.0 — one component per job, one entry per boundary.**

  The library used to ship its own implementation of components it also documented, and a separate
  `@ceebee/ui/antd` entry alongside it. That meant two answers to most questions. This release settles
  them: there is now exactly one of each component, reached through one of two entries.

  ### Entries

  `@ceebee/ui/antd` is gone. Everything it exported now comes from `@ceebee/ui/client`.

  ```diff
  - import { Button, Table } from '@ceebee/ui/antd';
  + import { Button, Table } from '@ceebee/ui/client';
  ```

  The split that remains is the one worth keeping: **`@ceebee/ui`** is server-safe and ships no client
  runtime; **`@ceebee/ui/client`** carries `"use client"`. `AntdThemeBridge` is renamed `ThemeBridge`
  (`AntdThemeBridgeProps` → `ThemeBridgeProps`); `ThemeProvider` wraps it for you, so most consumers
  never name it.

  ### Removed: duplicate implementations

  Every component that had a second implementation now has one. Import each from `@ceebee/ui/client`
  — same name, same API, themed by the active Skin:

  `Affix`, `Alert`, `Anchor`, `Avatar`, `Badge`, `BorderBeam`, `Breadcrumb`, `Button`, `Calendar`,
  `Card`, `Carousel`, `Collapse`, `Descriptions`, `Divider`, `Drawer`, `Dropdown`, `Empty`,
  `FloatButton`, `Image`, `Listy`, `Masonry`, `Menu`, `Modal`, `Notification`, `Pagination`,
  `Popconfirm`, `Popover`, `QRCode`, `Result`, `Skeleton`, `Space`, `Spin`, `Splitter`, `Statistic`,
  `Steps`, `Table`, `Tabs`, `Tag`, `Timeline`, `Tooltip`, `Tree`, `Watermark` — together with every
  `*Skeleton` variant and the sort, autoplay and table helpers that served them.

  Renamed on the way:

  | Removed                       | Use                                                 |
  | ----------------------------- | --------------------------------------------------- |
  | `ProgressBar`, `ProgressRing` | `Progress` (`type="circle"` for the ring)           |
  | `StaticAnchor`                | `Anchor`                                            |
  | `StaticSteps`                 | `Steps`                                             |
  | `LinkButton`                  | `Button` with `href`                                |
  | `AvatarGroup`                 | `Avatar.Group`                                      |
  | `DialogClose`, `DrawerClose`  | `Modal` and `Drawer` render their own close control |
  | `DateRangePicker`             | `DatePicker.RangePicker`                            |
  | `TreeSearchSelect`            | `TreeSelect` with `showSearch`                      |
  | `Coachmark`, `Tour`           | `Tour`                                              |

  `ringGeometry` and its `RingGeometry` type go with `ProgressRing`; they existed only to lay that ring
  out. Note `thickness` was a pixel width while `strokeWidth` is a percentage of the ring's diameter,
  and `tone`/`hue` become a `strokeColor` reading the matching Ceebee token:

  ```tsx
  // before
  <ProgressRing value={12} max={20} size={56} thickness={7} hue="blue" label="Review queue" />

  // after
  <Progress type="circle" percent={60} size={56} strokeWidth={12}
    strokeColor="var(--cb-decor-blue)" aria-label="Review queue" />
  ```

  `Coachmark` and `Tour` take `tourReducer`, `initialTourState`, `resolveTarget`, `hasEnded`, the
  `TourState` / `TourAction` / `TourStatus` / `StepTarget` types, and the `SeenStore` type with them —
  the Seen Store existed to remember whether a tour had run.

  ### Removed: the legacy form layer

  `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`/`RadioGroup`, `Switch`, `Rate`, `Slider`,
  `Upload`, `AutoComplete`, `Cascader`, `ColorPicker`, `DatePicker`, `TimePicker`, `InputNumber`,
  `Mentions`, `TreeSelect`, and `Transfer` are each replaced by the same-named export from
  `@ceebee/ui/client`, along with their skeletons, prop types, and the `date`, `time`, `number` and
  `upload` helpers that only served them.

  `Field` goes with them. It was the shared label, hint and error wiring behind all of the above;
  `Form.Item` is that contract:

  ```tsx
  import { Form, Input } from "@ceebee/ui/client";

  <Form layout="vertical">
    <Form.Item
      label="Email"
      extra="Work address"
      validateStatus="error"
      help="Already taken"
    >
      <Input />
    </Form.Item>
  </Form>;
  ```

  ### What stays

  The layout and foundation primitives (`Surface`, `Flex`, `Grid`, `Container`, `Text`, `Heading`,
  `PageContainer`), the app shell (`Sidebar`, `TopBar`, `NavigationMenu`), `CommandPalette`,
  `Checklist`, the widgets (`Donut`, `Sparkline`, `BarMini`, `Leaderboard`), the motion helpers, and
  the Token, Skin and Labels system.

  `Donut` stays alongside `Progress`: it draws one arc per slice, which `Progress` has no equivalent
  for. `Popover` and `Tooltip` stay — DatePicker, TimePicker, Cascader, Mentions, ColorPicker,
  Popconfirm, Slider, Steps, Menu and the app shell are all built on them.

  Two components had reached into something removed and now draw for themselves: `Leaderboard` renders
  its own initials bubble rather than `Avatar`, and `PageContainer.Skeleton` its own placeholders
  rather than `Skeleton` — both are server-safe, and the runtime's versions are not.

  The `Labels` contract loses `back`, `done`, `skip`, and `progress`, which only the removed Tour and
  Coachmark spoke. `next` stays — the carousel and the image preview still use it.

  ### Dependencies

  Dropped from `dependencies`: `uqr` and the thirteen `@rc-component/*` engines, none of which the
  package imports since the source ports that used them were removed. `antd` and `dayjs` remain.
  Attribution is unchanged: `THIRD_PARTY_NOTICES.md` retains every upstream copyright notice, and
  `docs/component-sources.json` still records each component's lineage.

  ### Slider reads its filled track from Ceebee's ramp

  The runtime derives a Slider's filled track, handle, and active dot from one palette step off the
  primary seed. That step lands close to white for a seed as light as Ceebee's brand, so a filled
  track was indistinguishable from its rail and the control read as disabled. `ThemeBridge` now sets
  `trackBg`, `trackHoverBg`, `handleColor`, and `dotActiveBorderColor` from `--cb-brand-300` and
  `--cb-brand-400`, which follow the active Skin and colour scheme like every other bridged token.

## 0.6.0

### Minor Changes

- a090d13: Add the server-safe Card family with Meta, responsive Grid, loading, and matching Skeleton anatomy.
- a090d13: Add Anchor, FloatButton, and Splitter with native navigation, action, and resizing contracts.
- a090d13: Add Collapse with single and multiple disclosure modes, add composable modal confirmation and
  matching Modal Skeleton coverage, and extend Image with grouped fullscreen preview, zoom, localized
  controls, controlled state, and matching preview-grid Skeletons.
- a090d13: Add a server-safe PageContainer frame with matching skeleton for ProLayout-style page composition.
- a090d13: Add anchored `Popconfirm`, persistent `Notification`, inline `Calendar`, persistent navigation
  `Menu`, and single/range `Slider` compositions with matching loading skeletons. Isolate
  DatePicker's internal calendar CSS namespace from Calendar.
- a090d13: Add TreeSelect, Cascader, semantic ColorPicker, and server-safe Listy components with matching skeletons.
- a090d13: Add Masonry, Affix, Watermark, and BorderBeam coverage with documented motion and loading contracts.
- a090d13: Add server-safe Space, Descriptions, and Result compositions with matching Skeletons.
- a090d13: Add hierarchical Tree, inline Mentions, two-list Transfer, and server-safe QRCode coverage.

### Patch Changes

- a090d13: Guard every `:hover` rule behind `@media (hover: hover)`.

  A touchscreen has no hover, so a browser applies `:hover` on tap and leaves it
  applied until something else is touched. Every pressable surface in this
  package — buttons, tags, tabs, table rows, calendar days, select options —
  therefore stayed lit after a finger passed over it, and a scroll left a trail of
  controls looking pressed. It was reported as "everything I scroll past gets
  clicked", which is exactly what it looks like.

  44 rules across 27 files. Where a selector list mixed `:hover` with
  `:focus-visible` or `[data-active]`, only the hover half moved: keyboard focus
  and keyboard selection are not hover, and both must keep working on a device
  that cannot hover.

## 0.5.2

### Patch Changes

- d241414: **An open `AutoComplete` list no longer rides over the page's sticky chrome.**

  The popup follows its anchor, and a page that scrolls takes the anchor with it.
  Measured at 390px against a sticky masthead, stepping the scroll:

  ```
  scrollY  anchorTop  overlapsHeader  anchorHidden
      120         23           false         false
      180        -37            TRUE         false
      240        -97            TRUE          true
  ```

  The anchor slides under the header while the popup, at `--cb-z-dropdown`, goes
  on being painted above it. Base UI marks the anchor hidden only once it has left
  the viewport entirely, so there is a band of scroll where nothing knows anything
  is wrong.

  No z-index settles it — a dropdown opened _from_ sticky chrome has to be above
  it, and one whose anchor has scrolled under it must not be — so the fix is
  behavioural. `AutoComplete` is modal now, which is what Base UI already makes a
  `Select` by default: the page is held still while the list is open and the
  situation cannot arise. On a touch device Base UI deliberately leaves the page
  scrollable (matching a native picker), so there the list closes on a page scroll
  instead. Scrolling the list itself does not close it.

  No API change. If you were relying on being able to scroll the page with an
  `AutoComplete` open, that is what changes.

## 0.5.1

### Patch Changes

- 11b8591: Two fixes to overlays measured on a phone-sized viewport.

  **A scrolling dialog's scrollbar no longer lands on its fields.** `Modal`'s body
  became an internally scrolling box in 0.5.0 so long content stays in the
  viewport; a scroller draws its bar at its own inline edge, and the body ran to
  the dialog's content edge. Measured at 390×780: the first input ran 41→349
  inside a 349-wide scroller — no gap at all. macOS and Android float an overlay
  bar over the field; Windows reserves width and squeezes it.

  `.cb-modal__body` and `.cb-drawer__body` now set `scrollbar-gutter: stable` and
  bleed into the dialog's own padding to put it back as their own, so the bar is
  drawn over padding rather than over content on either kind of platform. It also
  stops a focused field's ring being clipped at the scroller's edge.

  **A `Select` or `AutoComplete` popup is as wide as its options need.** Both were
  pinned to `--anchor-width`. Dropping from a field that is half a filter row —
  175px on a phone — options that are place names wrapped to two and three lines
  each: measured heights of 56, 56, 56, 76, 56 against 36 apiece once the popup
  sizes to its content.

  The anchor's width is the floor now rather than the value, so a popup is still
  never narrower than the field it belongs to, and the ceiling is
  `--available-width`, the room the positioner measured. `max-height` follows the
  same shape, so a long list on a short screen is bounded by the screen.

  No API changes; both are CSS, and both apply to every consumer on the next
  install.

## 0.5.0

### Minor Changes

- c37a843: **Breaking: fifteen components are renamed to the names Ant Design uses.**

  The old names are gone, not deprecated. A consumer upgrading to this release has
  to rename its imports; nothing warns at runtime, the build simply stops finding
  them.

  | Was            | Now            |
  | -------------- | -------------- |
  | `Stack`        | `Flex`         |
  | `StatCard`     | `Statistic`    |
  | `Breadcrumbs`  | `Breadcrumb`   |
  | `Dialog`       | `Modal`        |
  | `Combobox`     | `AutoComplete` |
  | `EmptyState`   | `Empty`        |
  | `DataTable`    | `Table`        |
  | `Spinner`      | `Spin`         |
  | `TextInput`    | `Input`        |
  | `DateInput`    | `DatePicker`   |
  | `TimeInput`    | `TimePicker`   |
  | `NumberInput`  | `InputNumber`  |
  | `FileDrop`     | `Upload`       |
  | `DropdownMenu` | `Dropdown`     |
  | `Stepper`      | `Steps`        |

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

- c37a843: Add an independent Drawer primitive and keep overlay interaction contracts separate. Establish a semantic stacking ladder for every portalled or fixed layer, with anchored overlays layered by their Positioner. Keep long Dialog content within the viewport with an internally scrolling body. Fix horizontal Popover and Coachmark arrows, and give Tooltip matching placement and optional-arrow controls. Let Combobox fetch its options per query with loadItems, debounced, guarded against out-of-order replies, and with browser-side matching switched off so a server's answer survives intact. Give RadioGroup a segmented variant for the two-to-four-option band where a Select costs a press for nothing, and align Combobox's option and id props with Select's so swapping between them is one word. Add LinkButton for the anchor that wears a button's look, sharing the button's classes rather than a second copy of them, with a render seam so a router's own Link stays itself.

## 0.4.1

### Patch Changes

- Keep tall grouped dropdown menus inside the viewport with contained internal scrolling.

## 0.4.0

### Minor Changes

- Add accessible labelled sections to DropdownMenu for app menus that combine distinct action kinds.

## 0.3.3

### Patch Changes

- Preserve the standard backdrop-filter declaration when consumer CSS is compiled by Lightning CSS.

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
