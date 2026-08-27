# Authoring a docs page

Every component in the catalog gets one page, and every page is the same page. A reader who has
learned to read the Button page has learned to read all of them; a reader who has to work out where
the examples live on this particular page has been failed before they reach the component.

`pnpm check:docs` enforces the machine-checkable half of this. The rest is judgement.

The shared docs chrome is also a visual contract. Sticky sidebar and topbar regions must be opaque,
cover their complete rail from edge to edge, and reserve space from adjacent sticky content such as
the page outline. Do not make a control sticky by styling only the control's intrinsic box: scrolling
content will leak around it. The browser invariant suite checks these boundaries at a deep page and
sidebar scroll position, so every component page inherits the same protection.

For audited components, `docs/component-capabilities.json` is the completeness interface. A
supported capability names its docs and public-interface test evidence; planned, replaced, and
deliberately absent capabilities carry a rationale. `built` in the roadmap never overrides that
evidence.

## The shape

```mdx
import { Demo } from '../../../components/demo';
import { PropsTable, Guidance } from '../../../components/props-table';
import { Thing } from '@ceebee/ui';

# Thing <span className="docs__label">Atom</span>

One paragraph: what it is, and the nearest component it is not.

## Usage            ← native Ceebee pages: canonical example first and live
## <each axis>      ← Variants, Tone, Size, States … one live example each
## Props            ← <PropsTable>
## Skeleton         ← live, if the component ships one
## Keyboard         ← a table, if it has a keyboard model
## Tokens           ← what it reads
<Guidance do dont />
```

Components carried over from the catalog baseline follow its documented page structure instead: `When to use` first,
then an `Examples` gallery containing the live cards in upstream order. Do not insert a duplicate,
untitled canonical card above that gallery merely to satisfy the native page shape.

Sections may be omitted. They may not be reordered: the checker reads
`Playground → Usage → … → Props → Skeleton → Keyboard → Tokens` and rejects anything that arrives
out of turn. Free-form sections belong between `Usage` and `Props`.

The tier in the title is one of the three `CONTEXT.md` defines — **Atom**, **Composition**, or
**Widget**. Not a fourth.

## Every example is live, and every example is framed

A component is documented by running it. A fenced ` ```tsx ` block is for something that cannot be
run on the page — a provider wired into an application, a router's `Link`, a handler the docs do not
own. It is never a substitute for the component itself.

Everything rendered on the page goes inside `<Demo>`, including Skeletons. A component dropped
straight into the prose has no stage around it, no source beside it, and no containment — which is
how a `position: fixed` component ends up in the corner of the docs site instead of in its own
example.

```mdx
<Demo code={`<Thing tone="brand" />`}>
  <Thing tone="brand" />
</Demo>
```

The `code` is not decoration. It is the claim the example is making about itself, so it names the
same components the stage renders — the checker compares the two — and it stays the shortest thing
that would actually reproduce what is on screen.

## The stage knows about layout, fixed, and sticky

| Prop | For |
| --- | --- |
| `layout="row"` | default; a row of controls |
| `layout="block"` | full width — tables, cards, dashboards |
| `layout="grid"` | several equal-width examples side by side |
| `contain` | `position: fixed` children — makes the stage their containing block |
| `scroll` | `position: sticky` children — gives them a scroll container to stick to |

Without `contain`, a fixed component escapes to the viewport. Without `scroll`, a sticky component
renders as an ordinary block and demonstrates nothing.

## Skeletons: `X.Skeleton` in the code, `XSkeleton` on the stage

An MDX page is a Server Component, so a client component reaches it as a client *reference* rather
than the function itself — and the statics attached with `Object.assign` do not survive that
crossing. `Result.Skeleton` works because `Result` is server-safe; `Watermark.Skeleton` throws at
render time with "Expected component … to be defined", which the build catches only when it
prerenders the page.

For anything imported from `@ceebee/ui/client`, import the standalone `XSkeleton` export and stage
that. Inside a client component — a demo in `docs/components/` — the compound is fine.

## Demos written as components

An example that needs state, a handler, or a trigger is a React component in `docs/components/`.
It returns `<Demo>` like any other example — never a hand-rolled `<div className="demo">`, or the
page stops matching the rest of the catalog the moment the frame changes.

And import `Demo` where you use it. MDX resolves an unknown component at render time, not at build
time, so a missing import is a blank page rather than a compile error.

## Cover the axes that exist

If a component takes `variant`, `tone`, `size`, or has meaningful states, each gets an example.
A prop documented in the table but never shown is a prop the reader has to imagine.
