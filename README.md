# @ceebee/ui

Ceebee's design system: Tokens, themed primitives, motion, and the onboarding pieces (Coachmark,
Tour) that plain component libraries leave out. React 19, Next App Router friendly, published to npm
and imported.

## Read first

- [CONTEXT.md](./CONTEXT.md) — the vocabulary. Atom, Composition, Recipe, Token, Skin, Surface, Tone,
  Coachmark, Tour, Seen Store, Widget vs Chart.
- [AGENTS.md](./AGENTS.md) — the authoring contract. Read before adding a component.
- [docs/adr/](./docs/adr/) — why the shape is the shape.
- [docs/inventory.md](./docs/inventory.md) — every planned component and where it sits in the build.

## Shape

```
packages/ui/          @ceebee/ui        — the library
  src/index.ts                          — server-safe entry
  src/client.ts                         — "use client" entry
  src/tokens/                           — structure + skin tokens, skins/
docs/                                   — Next 16 docs site (MDX, live examples, Recipes)
```

## Stack

React 19 · Base UI (behaviour) · Motion (animation) · Embla (carousel) · CSS Modules over CSS custom
properties · lucide-react as a peer for consumer icons · Vitest + Testing Library · Changesets.

## Working on it

```bash
pnpm install
pnpm dev        # docs site on http://localhost:4100
pnpm test       # vitest — logic, a11y wiring, reduced motion
pnpm build      # library: dist/index.js, dist/client.js, dist/styles.css, dist/skins/
pnpm typecheck
```

Releases go through Changesets: `pnpm changeset` to describe a change, and merging the generated
"Version Packages" PR publishes to npm.

## Status

Every component in [docs/inventory.md](./docs/inventory.md) is built, documented, and green:
foundation, the full form control set, feedback, overlays, data display, navigation and the app
shell, media, motion, and onboarding — plus all four Recipes reproducing screens from the reference
board. 113 tests cover the parts that can be wrong rather than the parts that are merely ugly.

## Install (once published)

```bash
pnpm add @ceebee/ui
```

```tsx
import '@ceebee/ui/styles.css';
import '@ceebee/ui/skins/astra.css';   // optional: a Skin rewrites brand tokens only

import { Surface, StatCard, ProgressRing, Skeleton } from '@ceebee/ui';   // server-safe
import { Button, Field, TextInput, Dialog } from '@ceebee/ui/client';     // interactive
```
