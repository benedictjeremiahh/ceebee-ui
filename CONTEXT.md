# @ceebee/ui

The shared UI library behind Ceebee's products: tokens, themed primitives, and the motion and
onboarding pieces that a plain component library does not give you. It is imported, never copied,
and it holds no product knowledge — no user, no storage, no data fetching.

## Language

### The pieces

**Atom**:
A component that cannot be decomposed further without becoming markup — Button, Skeleton,
Surface. A documentation label, never a folder.
_Avoid_: Element, base component

**Composition**:
A component assembled from Atoms that encodes a layout decision — StatCard, Carousel, Tour,
DataTable. Also a documentation label, never a folder.
_Avoid_: Molecule, organism, block

**Recipe**:
A whole screen built from the library and published in the docs site as copyable source. It proves
the library, it is not shipped by it — a Recipe lives only in docs.
_Avoid_: Template, example app, demo

**Widget**:
A small data display drawn as hand-written SVG — Donut, Sparkline, BarMini. It has no
axis and no scale.
_Avoid_: Chart, graph, visualization

**Chart**:
Anything needing an axis, a scale, or a tooltip over a series. Deliberately out of scope; the
consuming app picks its own charting library. The boundary is the axis.

### Style

**Token**:
A named design value exposed as a CSS custom property. Splits into *structure* (spacing, radius,
density, motion timing — stable across brands) and *skin* (colour, font, elevation, texture).
_Avoid_: Variable, constant, theme value

**Skin**:
One CSS file that rewrites the skin Tokens and nothing else. Swapping brands means loading a
different Skin, never editing a component.
_Avoid_: Theme file, brand config, palette

**Theme**:
The resolved light or dark rendering of the active Skin, selected by `data-theme` on the document
root, falling back to `prefers-color-scheme`.
_Avoid_: Mode, colour scheme

**Surface**:
The component every raised or tinted panel is built on. Its `variant` (`plain`, `tinted`, `glass`,
`gradient`) is what carries the Pinterest-board look, so glass and gradient are opt-in choices
rather than a baked-in identity.
_Avoid_: Panel, container, box

**Tone**:
The semantic colour a component wears — `neutral`, `brand`, `success`, `warning`, `danger`, `info`,
plus the decorative hues. A component takes a Tone, never a colour.
_Avoid_: Color prop, variant colour, intent

### Motion

**Motion Token**:
A named duration, easing, or spring preset (`fast`/`base`/`slow`, `snappy`/`soft`/`bouncy`). A
component reads a Motion Token; it never writes a raw duration, exactly as it never writes a hex.

**Motion Provider**:
The context that scales or disables all animation at once, and the seam that honours
`prefers-reduced-motion`. Reduced motion drops transforms and keeps opacity — it never means "no
feedback at all".

**Reduced Motion**:
The user's stated preference for less animation, treated as a hard requirement rather than a nicety.
Every animated component has a defined reduced-motion rendering.

### Onboarding

**Checklist**:
Getting-started tasks with progress. Which tasks are complete is passed in; the library holds no
account of who a user is or what they have done.
_Avoid_: Todo list, task tracker

Guided walkthroughs are `Tour`, exported from `@ceebee/ui/client`. The earlier `Coachmark` pair was
removed, and the `Seen Store` interface went with it: it existed so a Tour could ask whether a person
had already seen it.

### Loading

**Skeleton**:
The placeholder shape shown while content loads. Shape Atoms (`Skeleton.Text`, `.Circle`, `.Rect`)
exist for free-form cases, and every Composition ships its own `.Skeleton` built from the same
geometry as the real thing, so the placeholder cannot drift out of sync with what replaces it.
_Avoid_: Loader, placeholder, shimmer

### Boundaries

**Dialog**:
A modal interruption for a bounded decision or task. It is centred or corner-positioned; it is not
navigation and never grows a Drawer placement.

**Drawer**:
A modal edge panel for navigation or a longer contextual task. It owns a separate public component
and CSS namespace even though Base UI Dialog supplies its focus trap and dismissal semantics.

**Popover**:
An anchored, non-modal surface related to its trigger. Menu is the action-list contract built on
anchored menu behaviour, not a Dialog or Drawer variant.

**Menu**:
Persistent native-link navigation in document flow. It uses recursive path identity for current
destinations and branch disclosure state, retains native Tab order, and never portals, dismisses,
or adopts Dropdown's action-menu roving focus and typeahead.
_Avoid_: Persistent Dropdown, action list

**Stacking Ladder**:
The semantic global order for raised interaction layers: page chrome, modal, anchored controls,
informational overlays, command surfaces, notifications, then guided onboarding. Portalled anchored
layers assign their rung to the Positioner that creates the stacking context, not to its Popup.
_Avoid_: Arbitrary z-index, highest-number-wins

**Server-safe primitive**:
A component with no client-side behaviour, shipped without `"use client"` so a Next app keeps it as
a Server Component — typography, layout, static Surface, Badge, Divider, Skeleton.

**Tree**:
An ARIA hierarchical composite with recursive path identity, one roving focus, branch expansion,
and node selection. It stays in document flow and accepts static supplementary node content only;
Collapse and Menu retain their separate disclosure and navigation contracts.
_Avoid_: Nested Collapse, navigation Menu

**Card**:
A non-interactive Surface composition that groups content about one subject into optional cover,
header, body, and actions regions. Interaction belongs to controls inside the Card; the Card itself
is never a button.
_Avoid_: Clickable card, interactive Surface

**Collapse**:
A disclosure group whose native heading buttons reveal panels in document flow. Single and multiple
expansion are state modes of the same interaction contract; Collapse never dismisses or portals.
_Avoid_: Accordion variant, collapsible Card

**Modal confirmation**:
A composable preset of the viewport Modal contract for consequential decisions. It traps focus and
blocks the page like Modal; an anchored local decision remains `Popconfirm`.
_Avoid_: Confirm popup, imperative confirm API

**Popconfirm**:
An anchored, non-modal confirmation for one local action. It owns a short title, optional
consequence, composable close actions, outside and Escape dismissal, and focus return through Base
UI Popover. It never traps the viewport or becomes a small Modal.
_Avoid_: Confirmation modal, generic Popover with hand-wired dismissal

**Image Preview Group**:
A dialog-based collection viewer that turns explicitly named thumbnails into triggers, then owns
group navigation, zoom, dismissal, and focus restoration. A plain Image remains non-interactive.
_Avoid_: Clickable Image, product lightbox

**Space**:
A server-safe sibling-spacing composition. It can wrap, insert visual separators, or compact
adjacent controls, but it never owns distribution, focus, keyboard, value, or selection state.
_Avoid_: Generic flex wrapper, button group

**PageContainer**:
A server-safe page frame inside Container with optional breadcrumb, title, subtitle, extra, tabs,
and body regions. The app injects heading level and interactive content; routing, permissions,
fetching, and tab state remain external.
_Avoid_: Route configuration, authenticated shell

**Descriptions**:
A server-safe native description list for one record's label/value details. It owns responsive
geometry, not requests, editing, form state, or tabular interaction.
_Avoid_: Detail table, schema form

**Calendar**:
An inline six-week date grid for viewing and selecting days with injected static day content. It
owns roving day focus and displayed-month state, but no input field, popup, anchoring, dismissal,
or date data fetching; those boundaries keep it distinct from DatePicker.
_Avoid_: Inline DatePicker, event scheduler

**QRCode**:
A server-safe, non-interactive SVG image of an encoder-owned QR matrix. It requires an accessible
description, keeps encoded plaintext out of attributes, and owns no scanning, navigation,
downloads, history, or custom barcode algorithm.
_Avoid_: QR link, hand-written encoder

**Listy**:
A server-safe native list that preserves injected item identity and order, optionally groups
contiguous items, and can opt into browser-native rendering containment. Search, selection,
requests, editing, and true virtual-window state remain app-owned Recipes.
_Avoid_: Listbox, request-driven ProList

**Result**:
A server-safe presentational end state for a completed or failed flow. It renders semantic tone,
title, explanation, and composable actions without owning navigation or dismissal.
_Avoid_: Alert, redirect screen

**Notification**:
Server-safe, persistent rich status feedback in document flow. It can announce a title,
description, semantic tone, and composable app-owned actions, but owns no timer, queue, portal,
placement, storage, or dismissal state. Transient queued feedback remains Toast.
_Avoid_: Persistent Toast, notification provider

**Masonry**:
A server-safe ragged-column layout whose items pack vertically. It preserves child semantics and
does not promise the row alignment of Grid.
_Avoid_: Irregular Grid, card feed behavior

**Affix**:
A server-safe native sticky wrapper within the nearest scroll container. The consuming layout owns
the containing block and scroll state.
_Avoid_: Fixed action, scroll observer

**Watermark**:
A decorative SVG text pattern tiled above supplied content without intercepting interaction. Its
client boundary exists only for collision-safe SSR IDs; it owns no event or product-security state.
_Avoid_: Access control, sole warning channel

**BorderBeam**:
A client-bound decorative moving border whose content retains the interaction contract. Disabling
motion leaves a visible static border.
_Avoid_: Focus ring, loading indicator, status border

**Anchor**:
A server-safe native fragment-link outline for one page. Active-section observation is injected;
the component never becomes a scroll spy or a tab list.
_Avoid_: Breadcrumb, Tabs, scroll observer

**FloatButton**:
One fixed viewport action with native button semantics. Group disclosure, navigation, and BackTop
scroll ownership remain separate contracts.
_Avoid_: Floating link, action menu, scroll-to-top variant

**Splitter**:
Exactly two persistent panes and one keyboard/pointer separator. Its percentage covers the pane
space left after the fixed handle; Drawer and responsive navigation remain separate contracts.
_Avoid_: Resizable Drawer, draggable layout variant
