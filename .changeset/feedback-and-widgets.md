---
'@ceebee/ui': minor
---

Badge, Alert, EmptyState, Toast, Tabs, Avatar with AvatarGroup, Donut, Sparkline, and BarMini.

Alert distinguishes what interrupts from what waits: danger and warning are assertive alerts, the
quieter tones are polite status messages. Toast ships its own viewport with the provider, and an
error toast has no timeout. Avatar is server-safe — initials render underneath the image, so a
broken photo URL degrades without JavaScript, and the fallback colour is derived from the name so
a person keeps their colour everywhere.

The widget arithmetic is pure and tested: donut arcs drop values that cannot be drawn instead of
drawing them backwards, and a sparkline puts a flat series on the middle line rather than
collapsing it onto the floor.
