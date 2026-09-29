---
'@ceebee/ui': minor
---

Schedule discloses child rows from the parent's identity cell. Items with a `parentId` start collapsed, the chevron and item count expose `aria-expanded`, and expansion survives fullscreen. A child may state no dates (`unscheduled: true`): it stays in its group, is labelled, and draws no bar. A parent with only some children dated says its coverage is partial.
