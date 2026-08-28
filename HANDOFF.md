# Handoff: move the consuming apps to @ceebee/ui 1.0.1

Delete this file when the four apps are on 1.0.1. It is execution state, not documentation —
[UPGRADING.md](./UPGRADING.md) is the reference and outlives it.

## Where things stand

`@ceebee/ui@1.0.1` is published and the docs are live at https://ui.ceebee.biz.id.
Nothing has been migrated yet. All four apps are still on their old versions and still build,
because npm ranges do not cross a major on their own.

| App | Declared | Git | Symbol sites | Prop sites |
| --- | --- | --- | --- | --- |
| `ceebee-price-reference` | `^0.3.0` | **not a repo** | 1 | 7 |
| `ceebee-home` | **done — 1.0.1** | `780ae06` | — | — |
| `ceebee-monitor` | `^0.3.3` | **34 files uncommitted** at `3d154e2` | 7 | 2 |
| `ceebee-list` | `^0.6.0` | clean at `9157d08` | 23 | 237 |

Counts are from a scan of each working tree against 1.0.1's real export surface — runtime exports
plus the type surface, so type-only imports are not miscounted as breaks. Re-measure rather than
trust these if the apps have moved on.

## Before touching anything

**`ceebee-price-reference` has no git.** `git init` and commit it first. This migration is a large
mechanical rename; without version control a bad `sed` is unrecoverable. Do not start here despite
it being the smallest.

**`ceebee-monitor` has 34 uncommitted files**, including `app/page.tsx` and `components/monitor.tsx`
— both files the upgrade has to touch. Commit or stash that work first, or the upgrade diff and
whatever is in progress become one indistinguishable change.

## Order

1. ~~`ceebee-home`~~ — done. It earned its place: it has no `ThemeProvider`, so `Badge → Tag` would
   have added a client boundary to a server-only page. UPGRADING.md now covers that case.
2. `ceebee-price-reference` — after `git init`.
3. `ceebee-monitor` — after its tree is clean.
4. `ceebee-list` — 260 sites. Everything the first three teach you gets used here.

The point of the order is that the three small apps are the same migration at a size where a mistake
is obvious. If UPGRADING.md is wrong about something, it surfaces there and not after a day in
`ceebee-list`.

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
