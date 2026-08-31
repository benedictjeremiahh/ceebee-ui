# ADR 0023: Generated Ant seeds enable mode-aware server rendering

## Status

Accepted.

## Context

ThemeBridge historically read CSS Custom Properties from the live DOM. That made the browser seed
correct but left server rendering with an empty seed. Ant style extraction therefore emitted its
default light palette and geometry, including a white control on a dark page. The pre-paint layer in
ADR 0022 removed the visible first-paint defect but did not make extracted Ant styles trustworthy.

Applications cannot solve this by copying colour values into product code: CSS Tokens are the Skin
source of truth, and a second theme table would drift. The server also needs the resolved light/dark
mode; a client-only localStorage choice is unavailable while rendering the request.

## Decision

The existing CSS-to-Flutter generator also emits a TypeScript Ant seed registry for every supported
Skin, light/dark mode, and normal/more contrast rendering. It converts the resolved OKLCH Tokens to
RGBA because Ant's palette implementation does not accept OKLCH input. The generator's check mode
guards both web and Flutter artefacts against their shared CSS source.

ThemeBridge starts from that generated seed on server and client, then refreshes from live CSS after
mounting. ThemeProvider accepts a serializable `initialMode`, `skin`, and `contrast`; it persists the
resolved mode in the non-sensitive `cb-theme-mode` cookie. A server-safe helper parses that cookie so
framework code does not depend on browser APIs or copy design-system values.

The first request may not carry a mode cookie. An application supplies its documented default for
that request and the ADR 0022 pre-paint layer remains the safe fallback. CeeBee does not pretend a
server can infer an unseen browser preference.

## Consequences

- Server-extracted Ant CSS can use the same mode and Skin as the rendered document after the first
  resolved-mode cookie exists.
- Product code owns request/cookie access but not token parsing, conversion, or Ant seed values.
- `moodboard` joins the generated Flutter Skin registry; a documented Skin may not exist on only one
  platform.
- Changing a Skin Token can change generated TypeScript and Dart artefacts in the same commit.
- ADR 0022's rejection of a generated seed described the then-unimplemented API cost; this ADR
  accepts that cost and supersedes only that rejection. The pre-paint decision remains in force.
