---
"@ceebee/ui": major
---

**1.0.0 — one component per job, one entry per boundary.**

The library used to ship its own implementation of components it also documented, and a separate
`@ceebee/ui/antd` entry alongside it. That meant two answers to most questions. This release settles
them: there is now exactly one of each component, reached through one of two entries.

### Entries

`@ceebee/ui/antd` is gone. Everything it exported now comes from `@ceebee/ui/client`.

```diff
- import { Button, Table } from '@ceebee/ui/antd';
+ import { Button, Table } from '@ceebee/ui/client';
```

The split that remains is the one worth keeping: **`@ceebee/ui`** is server-safe and ships no client
runtime; **`@ceebee/ui/client`** carries `"use client"`. `AntdThemeBridge` is renamed `ThemeBridge`
(`AntdThemeBridgeProps` → `ThemeBridgeProps`); `ThemeProvider` wraps it for you, so most consumers
never name it.

### Removed: duplicate implementations

Every component that had a second implementation now has one. Import each from `@ceebee/ui/client`
— same name, same API, themed by the active Skin:

`Affix`, `Alert`, `Anchor`, `Avatar`, `Badge`, `BorderBeam`, `Breadcrumb`, `Button`, `Calendar`,
`Card`, `Carousel`, `Collapse`, `Descriptions`, `Divider`, `Drawer`, `Dropdown`, `Empty`,
`FloatButton`, `Image`, `Listy`, `Masonry`, `Menu`, `Modal`, `Notification`, `Pagination`,
`Popconfirm`, `Popover`, `QRCode`, `Result`, `Skeleton`, `Space`, `Spin`, `Splitter`, `Statistic`,
`Steps`, `Table`, `Tabs`, `Tag`, `Timeline`, `Tooltip`, `Tree`, `Watermark` — together with every
`*Skeleton` variant and the sort, autoplay and table helpers that served them.

Renamed on the way:

| Removed | Use |
| --- | --- |
| `ProgressBar`, `ProgressRing` | `Progress` (`type="circle"` for the ring) |
| `StaticAnchor` | `Anchor` |
| `StaticSteps` | `Steps` |
| `LinkButton` | `Button` with `href` |
| `AvatarGroup` | `Avatar.Group` |
| `DialogClose`, `DrawerClose` | `Modal` and `Drawer` render their own close control |
| `DateRangePicker` | `DatePicker.RangePicker` |
| `TreeSearchSelect` | `TreeSelect` with `showSearch` |
| `Coachmark`, `Tour` | `Tour` |

`ringGeometry` and its `RingGeometry` type go with `ProgressRing`; they existed only to lay that ring
out. Note `thickness` was a pixel width while `strokeWidth` is a percentage of the ring's diameter,
and `tone`/`hue` become a `strokeColor` reading the matching Ceebee token:

```tsx
// before
<ProgressRing value={12} max={20} size={56} thickness={7} hue="blue" label="Review queue" />

// after
<Progress type="circle" percent={60} size={56} strokeWidth={12}
  strokeColor="var(--cb-decor-blue)" aria-label="Review queue" />
```

`Coachmark` and `Tour` take `tourReducer`, `initialTourState`, `resolveTarget`, `hasEnded`, the
`TourState` / `TourAction` / `TourStatus` / `StepTarget` types, and the `SeenStore` type with them —
the Seen Store existed to remember whether a tour had run.

### Removed: the legacy form layer

`Input`, `Textarea`, `Select`, `Checkbox`, `Radio`/`RadioGroup`, `Switch`, `Rate`, `Slider`,
`Upload`, `AutoComplete`, `Cascader`, `ColorPicker`, `DatePicker`, `TimePicker`, `InputNumber`,
`Mentions`, `TreeSelect`, and `Transfer` are each replaced by the same-named export from
`@ceebee/ui/client`, along with their skeletons, prop types, and the `date`, `time`, `number` and
`upload` helpers that only served them.

`Field` goes with them. It was the shared label, hint and error wiring behind all of the above;
`Form.Item` is that contract:

```tsx
import { Form, Input } from '@ceebee/ui/client';

<Form layout="vertical">
  <Form.Item label="Email" extra="Work address" validateStatus="error" help="Already taken">
    <Input />
  </Form.Item>
</Form>
```

### What stays

The layout and foundation primitives (`Surface`, `Flex`, `Grid`, `Container`, `Text`, `Heading`,
`PageContainer`), the app shell (`Sidebar`, `TopBar`, `NavigationMenu`), `CommandPalette`,
`Checklist`, the widgets (`Donut`, `Sparkline`, `BarMini`, `Leaderboard`), the motion helpers, and
the Token, Skin and Labels system.

`Donut` stays alongside `Progress`: it draws one arc per slice, which `Progress` has no equivalent
for. `Popover` and `Tooltip` stay — DatePicker, TimePicker, Cascader, Mentions, ColorPicker,
Popconfirm, Slider, Steps, Menu and the app shell are all built on them.

Two components had reached into something removed and now draw for themselves: `Leaderboard` renders
its own initials bubble rather than `Avatar`, and `PageContainer.Skeleton` its own placeholders
rather than `Skeleton` — both are server-safe, and the runtime's versions are not.

The `Labels` contract loses `back`, `done`, `skip`, and `progress`, which only the removed Tour and
Coachmark spoke. `next` stays — the carousel and the image preview still use it.

### Dependencies

Dropped from `dependencies`: `uqr` and the thirteen `@rc-component/*` engines, none of which the
package imports since the source ports that used them were removed. `antd` and `dayjs` remain.
Attribution is unchanged: `THIRD_PARTY_NOTICES.md` retains every upstream copyright notice, and
`docs/component-sources.json` still records each component's lineage.
