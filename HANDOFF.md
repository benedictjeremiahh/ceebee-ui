# Handoff: move the consuming apps to @ceebee/ui 1.0.1

Delete this file when the four apps are on 1.0.1. It is execution state, not documentation —
[UPGRADING.md](./UPGRADING.md) is the reference and outlives it.

## Where things stand

All four consumers are on `@ceebee/ui@1.0.1`.

| App | State |
| --- | --- |
| `ceebee-home` | done — uses the library's `Tag`, with `ThemeProvider` in the root layout |
| `ceebee-price-reference` | done — left on a local pill by request; `git init`'d, baseline at `54b6175` |
| `ceebee-list` | done — 286 typecheck errors to zero, build passes, `ThemeBridge` under its own provider |
| `ceebee-monitor` | done — `ThemeProvider` added; **left uncommitted on purpose**, alongside its owner's in-flight work |

`ceebee-monitor` is the only one with nothing committed. That was decided, not forgotten: its tree
already held 34 files of an unrelated redesign, and separating the two is the owner's call.

Nothing is pushed. Every app is committed locally except monitor.

## The one that has no compiler behind it

`Badge` changed meaning. Ceebee's was a chip that wrapped content; the runtime's is a count overlay
that draws a dot in a corner. Same name, same import, types still pass. The page just renders wrong.

Every `<Badge>` that wraps text is now `<Tag>`. There are 39 in all: 33 in `ceebee-list`, 3 in
`ceebee-price-reference`, 2 in `ceebee-home`, 1 in `ceebee-monitor`. Grep for them by hand — `tsc`
will not help, and neither will the tests.

## Everything else is in UPGRADING.md

The symbol table, the prop translations per component, and the per-app step list are there. The
short version: removed symbols are the small half of the work, prop renaming is ~90% of it, and in
`ceebee-list` `Button` (165) and `Badge` (43) are 88% of the prop sites.

## Verifying an app is done

```bash
pnpm add @ceebee/ui@latest
pnpm exec tsc --noEmit          # catches every symbol and most props
grep -rn '<Badge' app components # catches the one tsc cannot
pnpm build
```

Then run it and walk the pages that changed. `ceebee-list`'s `app/ui-probe/` exists for exactly this
and is the only place any app uses `Coachmark` → `Tour`.

## Watch for

- **`onChange` changed shape.** Ceebee's form controls called it with the value; the runtime's call
  it with the event. Every control out of the legacy form layer is affected, and the type error it
  produces points at the handler rather than the cause.
- **`tone` is two different prop systems sharing a name.** On `Text`, `Heading`, and `Surface` it is
  still Ceebee's and does not move. On `Button`, `Badge`, `Alert`, and `Tag` it does. A blind
  find-and-replace across a file will break the ones that were fine.
- **`variant="ghost"` is a trap.** The runtime has a `ghost` prop and it means something else — a
  transparent button for a coloured surface. Ceebee's quiet button is `variant="text"`.

## Open, not blocking

- `pnpm check:docs` in this repo reports 315 problems, all stale — the rules encode the pre-1.0 docs
  architecture (tier labels, `PropsTable`, `ApiReference` inside a `Demo`). Not a CI gate. The
  replacement rules are a product decision, not a mechanical fix.
- 57 demo images load from `gw.alipayobjects.com`. Asset URLs, not branding, but an external host.
