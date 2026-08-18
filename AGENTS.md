# Authoring contract for @ceebee/ui

Read before adding or changing a component. These rules exist so a new component looks like the rest
without invention, and so nothing has to be re-litigated per component. The reasoning is in
[docs/adr/](./docs/adr/); the vocabulary is in [CONTEXT.md](./CONTEXT.md).

## Hard rules

1. **No raw values.** Colour, spacing, radius, duration, and easing come from Tokens. Never a hex,
   never `200ms`, never `padding: 13px`. A component takes a **Tone**, not a colour (ADR 0002).
2. **Pick a side of the client boundary, once.** A component is server-safe or it is client. Server-
   safe means: no hooks, no event handlers, no `motion`. It exports from `src/index.ts`; client
   components export from `src/client.ts` and carry `"use client"` (ADR 0004).
3. **Behaviour comes from Base UI.** Overlays, focus management, dismiss layers, and anchoring are
   Base UI's job. Do not hand-roll a focus trap (ADR 0003).
4. **Every Composition ships `X.Skeleton`.** Built from the same Tokens as `X`. A Composition without
   one is unfinished (ADR 0009).
5. **Every animation has a reduced-motion rendering.** Transform drops, opacity stays. Never leave a
   state change invisible under reduced motion (ADR 0004).
6. **Folder is the job, not the tier.** `form/`, `data/`, `feedback/`, `overlay/`, `nav/`, `media/`,
   `motion/`, `onboarding/`. Atom and Composition are docs labels (ADR 0005).
7. **No product knowledge.** No fetching, no storage, no auth, no user. Anything the library needs to
   know about the outside world arrives as an injected adapter (ADR 0006).
8. **Test what can be wrong.** Logic, sequencing, a11y wiring, reduced motion — yes. CSS values —
   no (ADR 0012).

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
