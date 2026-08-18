# @ceebee/ui

The shared UI library behind Ceebee's products: tokens, themed primitives, and the motion and
onboarding pieces that a plain component library does not give you. It is imported, never copied,
and it holds no product knowledge — no user, no storage, no data fetching.

## Language

### The pieces

**Atom**:
A component that cannot be decomposed further without becoming markup — Button, Skeleton, Field,
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
A small data display drawn as hand-written SVG — ProgressRing, Donut, Sparkline, BarMini. It has no
axis and no scale.
_Avoid_: Chart, graph, visualization

**Chart**:
Anything needing an axis, a scale, or a tooltip over a series. Deliberately out of scope; the
consuming app picks its own charting library. The boundary is the axis (ADR 0007).

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
rather than a baked-in identity (ADR 0002).
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

**Coachmark**:
One anchored bubble pointing at a target element: spotlight, arrow, copy, actions, focus trap,
dismiss. It knows about one element and nothing else.
_Avoid_: Tooltip, training bubble, hint, popover

**Tour**:
The controller that sequences Coachmarks — order, next/prev/skip, scroll-into-view, progress. A Tour
owns sequence; it does not own memory.
_Avoid_: Walkthrough, onboarding flow, wizard

**Step**:
One entry in a Tour: a target selector or ref, the Coachmark content, and its placement.

**Seen Store**:
The adapter a consuming app injects so a Tour can ask "has this person seen this?" The library
defines the interface and ships no implementation, because it must not know who a user is or where
their state lives (ADR 0006).
_Avoid_: Storage, persistence layer, localStorage

### Loading

**Skeleton**:
The placeholder shape shown while content loads. Shape Atoms (`Skeleton.Text`, `.Circle`, `.Rect`)
exist for free-form cases, and every Composition ships its own `.Skeleton` built from the same
geometry as the real thing, so the placeholder cannot drift out of sync with what replaces it
(ADR 0009).
_Avoid_: Loader, placeholder, shimmer

### Boundaries

**Server-safe primitive**:
A component with no client-side behaviour, shipped without `"use client"` so a Next app keeps it as
a Server Component — typography, layout, static Surface, Badge, Divider, Skeleton (ADR 0004).

**Field**:
The a11y wiring around one input: label, hint, error, and the `aria-describedby` / `aria-invalid`
links between them. The library owns Fields and refuses to own forms — no validation engine, no
form state (ADR 0011).
_Avoid_: FormField, form control, form
