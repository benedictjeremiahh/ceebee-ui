# Authoring contract for @ceebee/ui

Read before adding or changing a component. These rules exist so a new component looks like the rest
without invention, and so nothing has to be re-litigated per component. The vocabulary is in [CONTEXT.md](./CONTEXT.md).

## Hard rules

1. **No raw values.** Colour, spacing, radius, duration, and easing come from Tokens. Never a hex,
   never `200ms`, never `padding: 13px`. A component takes a **Tone**, not a colour.
2. **Pick a side of the client boundary, once.** A component is server-safe or it is client. Server-
   safe means: no hooks, no event handlers, no `motion`. It exports from `src/index.ts`; client
   components export from `src/client.ts` and carry `"use client"`.
3. **Prefer the vendored runtime.** Components available in the pinned upstream runtime are exported
   from `@ceebee/ui/client`; upstream owns their API, DOM, interaction, accessibility, motion, and
   geometry. Ceebee owns their ThemeProvider Skin bridge and package seam. Explicit exceptions retain
   their recorded Ceebee or external substrate.
4. **Every Composition ships `X.Skeleton`.** Built from the same Tokens as `X`. A Composition without
   one is unfinished.
5. **Every animation has a reduced-motion rendering.** Transform drops, opacity stays. Never leave a
   state change invisible under reduced motion.
6. **Folder is the job, not the tier.** `form/`, `data/`, `feedback/`, `overlay/`, `nav/`, `media/`,
   `motion/`, `onboarding/`. Atom and Composition are docs labels.
7. **No product knowledge.** No fetching, no storage, no auth, no user. Anything the library needs to
   know about the outside world arrives as an injected adapter.
8. **Test what can be wrong.** Logic, sequencing, a11y wiring, reduced motion — yes. CSS values —
   no.
9. **One interaction contract, one component.** For every existing or proposed component, compare
   semantic role, keyboard/focus model, state/value ownership, dismissal, anchoring/layout, and
   gesture model. A material difference in any of them requires a separate public component, props,
   tests, docs, and `cb-` CSS namespace. `variant`, `size`, `tone`, and `placement` may change visual
   treatment or geometry only; they must not switch the interaction contract. Shared upstream
   behaviour and internal utilities are encouraged, but a generic public component is not.
10. **Record every substrate.** `docs/component-sources.json` names each component's substrate and,
    for a vendored runtime, pins the upstream package, version and commit — that record is what keeps
    `THIRD_PARTY_NOTICES.md` honest, so preserve it and record explicit exceptions. The upstream
    documented surface is the compatibility gate; Ceebee owns Skins, the token bridge, and additive
    package extensions (ADRs 0016 and 0019).
11. **Use the semantic stacking ladder.** Global layers use only the `--cb-z-*` Tokens in their
    documented order. A portalled overlay assigns its rung to the positioning root that creates the
    stacking context through the selected substrate's documented API. Raw `z-index` is allowed only
    for local children inside one component's stacking context.
12. **Protect the consumer boundary.** Every CeeBee web product consumes the versioned package,
    reuses a matching Composition before primitives, and reaches interaction runtimes only through
    `@ceebee/ui`. Run `pnpm check:consumers` when this public surface or its consumer contract changes.
13. **Keep inspectable media inspectable.** Screenshots and gallery media that users are expected to
    inspect open a viewport-sized preview through `Image` preview or `Image.PreviewGroup`. Consumers
    must preserve the shared pointer, keyboard, dismissal, focus, zoom, navigation, and mobile contract
    rather than implementing a product-local lightbox.

## Component-boundary check

Before adding a component or a new variant, write down its role, keyboard/focus behavior, state
model, dismissal, positioning, and gestures. If they match an existing component, extend it only
with visual or geometric props. If one materially differs, make a new component and add a regression
test proving the contracts remain distinct. Dialog/Drawer and Popover/Menu are the canonical cases.

## Shape of a component

```
src/<group>/<component>/
  <component>.tsx          # the component
  <component>.css          # plain cb-prefixed CSS, tokens only
  <component>.skeleton.tsx # for Compositions
  <component>.spec.tsx     # what can be wrong
  index.ts                 # public exports
```

Its docs page lands in `docs/content/<group>/<component>.mdx` in the same change: anatomy, props,
one canonical usage example, at least one do/don't pair, the Tokens it reads, and the keyboard map
if it has one.

## Props conventions

- `tone` — semantic colour (`neutral | brand | success | warning | danger | info`)
- `size` — `sm | md | lg`, never numbers
- `variant` — visual treatment; on `Surface` this is `plain | tinted | glass | gradient`
- `motion={false}` — every animated component accepts it
- `asChild` — render-prop style composition where Base UI offers it; do not invent a second mechanism
- Never a `className` escape hatch used to smuggle in raw values; if a consumer needs a change, the
  Token or the variant is the place to make it.
