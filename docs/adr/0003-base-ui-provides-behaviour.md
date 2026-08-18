# Behaviour and accessibility come from Base UI

Dialog, Popover, Tooltip, Select, Tabs, and the anchoring under Coachmark are built on Base UI
(stable since December 2025, from the engineers who built Radix, and shadcn's default since July
2026) rather than hand-rolled. Focus trapping, dismiss layers, scroll locking, roving tabindex, and
`inert` are each weeks of work and fail silently when wrong, and Base UI exposes state as
data-attributes, which is exactly what plain CSS styling (ADR 0002) wants.

## Consequences

- Base UI is a peer dependency, and its major upgrades become our upgrades.
- Radix was the safe alternative and was rejected on velocity after the WorkOS acquisition, not on
  quality. If Base UI stalls, this is the decision to revisit.
