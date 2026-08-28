# Upgrading to @ceebee/ui 1.0

1.0 removed every component that had a second implementation, so there is now one of each, reached
through one of two entries. That is a large removal, and the work it creates in a consuming app is
not evenly spread: most of it is mechanical prop renaming, one item is a silent behaviour change,
and the rest is a short list of symbols with named replacements.

Read the silent one first. Everything below it is a lookup table.

## Read this first: `Badge` changed meaning

Ceebee's `Badge` was a chip — it wrapped content and drew a pill around it. The runtime's `Badge` is
a count overlay: it wraps children and draws a dot or number in the corner. The import still
resolves and the types still pass, so nothing tells you. The page just renders wrong.

The chip is now `Tag`:

```diff
- <Badge tone="brand" variant="soft">{item.cuisine}</Badge>
+ <Tag color="blue">{item.cuisine}</Tag>

- <Badge tone="neutral" variant="outline">★ {rating}</Badge>
+ <Tag bordered>★ {rating}</Tag>
```

Keep `Badge` only where you actually wanted a count or a dot on a corner.

`Tag` is a client component, and like every component the runtime supplies it renders unthemed
unless a `ThemeProvider` sits above it. In an app that already mounts one, the swap above is the
whole story.

In an app that does not — one rendered entirely on the server, with no client runtime from this
library — taking `Tag` means adding a client boundary *and* a provider in the root layout. For a few
decorative pills that is a bad trade. Build the pill locally from tokens instead:

```tsx
<span className="chip chip--brand">{label}</span>
```

```css
.chip {
  display: inline-flex; align-items: center; gap: var(--cb-space-2);
  padding: var(--cb-space-1) var(--cb-space-3);
  border-radius: var(--cb-radius-full);
  font-size: var(--cb-text-xs); font-weight: var(--cb-weight-semibold);
}
.chip--brand {
  background: color-mix(in oklch, var(--cb-tone-brand) 14%, transparent);
  color: var(--cb-tone-brand);
}
```

`ceebee-home` went this way. Check for a `ThemeProvider` before you reach for `Tag`.

## Removed symbols

Each has a direct replacement. Both entries export from the same names, so only the specifier and
the symbol change.

| Removed | Use | Entry |
| --- | --- | --- |
| `Stack` | `Flex` | `@ceebee/ui` |
| `StatCard` | `Statistic` | `@ceebee/ui/client` |
| `Breadcrumbs` | `Breadcrumb` | `@ceebee/ui/client` |
| `Field` | `Form.Item` | `@ceebee/ui/client` |
| `Textarea` | `Input.TextArea` | `@ceebee/ui/client` |
| `LinkButton` | `Button` with `href` | `@ceebee/ui/client` |
| `ProgressBar` | `Progress` | `@ceebee/ui/client` |
| `ProgressRing` | `Progress` with `type="circle"` | `@ceebee/ui/client` |
| `DateRangePicker` | `DatePicker.RangePicker` | `@ceebee/ui/client` |
| `TreeSearchSelect` | `TreeSelect` with `showSearch` | `@ceebee/ui/client` |
| `AvatarGroup` | `Avatar.Group` | `@ceebee/ui/client` |
| `Coachmark` | `Tour` | `@ceebee/ui/client` |
| `DialogClose`, `DrawerClose` | nothing — `Modal` and `Drawer` draw their own close control | — |
| `MenuItem`, `MenuSection` | `MenuProps['items']` | `@ceebee/ui/client` |

`@ceebee/ui/antd` is gone. Everything it exported is on `@ceebee/ui/client`:

```diff
- import { Button, Table } from '@ceebee/ui/antd';
+ import { Button, Table } from '@ceebee/ui/client';
```

### `Field` → `Form.Item`

`Field` carried the label, description, and error wiring for a control. `Form.Item` is that contract:

```diff
- <Field label="Email" hint="Work address" error={errors.email}>
-   <Input value={email} onChange={setEmail} />
- </Field>
+ <Form.Item label="Email" extra="Work address"
+   validateStatus={errors.email ? 'error' : undefined} help={errors.email}>
+   <Input value={email} onChange={(e) => setEmail(e.target.value)} />
+ </Form.Item>
```

Note the handler: Ceebee's inputs called `onChange` with the value, the runtime's call it with the
event. That applies to every control that came out of the legacy form layer.

## Renamed props

The runtime does not speak Ceebee's prop vocabulary. `Surface`, `Flex`, `Grid`, `Container`, `Text`,
and `Heading` are still Ceebee's and are unaffected — only components the runtime now supplies.

**Every component**

| Was | Now |
| --- | --- |
| `size="sm"` | `size="small"` |
| `size="md"` | `size="middle"` (the default — usually just delete it) |
| `size="lg"` | `size="large"` |

**Button**

| Was | Now |
| --- | --- |
| `tone="neutral"` | omit, or `color="default"` |
| `tone="brand"` | `type="primary"` |
| `tone="danger"` | `danger` |
| `variant="solid"` | `variant="solid"` |
| `variant="outline"` | `variant="outlined"` |
| `variant="ghost"` | `variant="text"` |

The runtime has its own `ghost` prop and it means something else: a transparent button for use on a
coloured surface. Do not map `variant="ghost"` onto it.

**Alert**

| Was | Now |
| --- | --- |
| `tone="danger"` | `type="error"` |
| `tone="warning"` | `type="warning"` |
| `tone="info"` | `type="info"` |
| `tone="success"` | `type="success"` |

**Tag** (and `Badge` once it becomes `Tag`)

| Was | Now |
| --- | --- |
| `tone="neutral"` | omit |
| `tone="brand"` | `color="blue"` |
| `tone="info"` | `color="blue"` |
| `tone="warning"` | `color="orange"` |
| `tone="danger"` | `color="red"` |
| `variant="outline"` | `bordered` |
| `variant="solid"`, `variant="soft"` | a `color` — the runtime has one filled treatment |

**Modal**

`size` is gone; `width` takes a number. `tone` and `variant` have no equivalent — a destructive
confirm is `okButtonProps={{ danger: true }}`.

**Skeleton**

`radius` is gone. Reach for `className` or `style`.

## Unchanged

- `@ceebee/ui/styles.css` and `@ceebee/ui/skins/*.css` import exactly as before.
- `ThemeProvider`, `MotionProvider`, `ToastProvider`, `LabelsProvider` keep their APIs.
- `Surface`, `Flex`, `Grid`, `Container`, `Text`, `Heading`, `PageContainer` keep their props.
- `Donut`, `Sparkline`, `BarMini`, `Leaderboard`, `CommandPalette`, `Checklist`, `Sidebar`, `TopBar`.

`AntdThemeBridge` is renamed `ThemeBridge`, but `ThemeProvider` wraps it, so most apps never name it.

## Work order

Measured against each app as it stands today. Symbol sites are imports that no longer resolve; prop
sites are attributes the runtime will ignore or reject.

| App | On | Symbol sites | Prop sites | Shape of the work |
| --- | --- | --- | --- | --- |
| `ceebee-price-reference` | 0.3.0 | 1 | 7 | An afternoon. Do this one first. |
| `ceebee-home` | 0.3.0 | 2 | 5 | An afternoon. |
| `ceebee-monitor` | 0.3.3 | 7 | 2 | `Stack`, `StatCard`, `Breadcrumbs`, then done. |
| `ceebee-list` | 0.6.0 | 23 | 239 | The real one. Budget properly. |

Go in that order. The three small apps are the same migration at a size where a mistake is obvious,
and they will surface anything this guide gets wrong before it costs a day in `ceebee-list`.

### Per app

1. `pnpm add @ceebee/ui@latest`
2. Point every `@ceebee/ui/antd` import at `@ceebee/ui/client`.
3. Replace removed symbols from the table above.
4. `pnpm exec tsc --noEmit`. Fix until clean — this catches every symbol and most props.
5. Search for `<Badge` by hand. The type checker will not flag it, and it will render wrong.
6. Search for `onChange` on migrated form controls: the value became an event.
7. Run the app and walk the pages that changed.

Step 5 is not optional and does not have a compiler behind it.

### `ceebee-list` specifically

239 prop sites is mechanical but not blind — `tone` on a `Button` and `tone` on a `Text` are
different prop systems that happen to share a name, and only the first one moves. Migrate one
component at a time and typecheck between each, committing per component so a bad rename is one
revert rather than a bisect. The 237 sites concentrate hard:

| Component | Sites |
| --- | --- |
| `Button` | 165 |
| `Badge` | 43 |
| `Alert` | 11 |
| `Modal` | 6 |
| `Tag` | 4 |
| `Skeleton`, `Dropdown`, `Drawer`, `Popover` | 2 each |

`Button` and `Badge` are 88% of it. Clear those two and the rest is an afternoon.

`app/ui-probe/` uses `Coachmark`. That is the only `Tour` work in any app.
