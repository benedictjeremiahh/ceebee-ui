---
'@ceebee/ui': minor
---

DataTable with sortable headers and its own Skeleton, Pagination, DropdownMenu, Breadcrumbs,
Stepper, and the Sidebar and TopBar shell.

Sorting cycles through three states, so there is a way back to the order the server gave, and the
state lives on the header as `aria-sort` rather than only in the arrow. The page list keeps the
first and last page reachable and spells out a single skipped page instead of hiding it behind an
ellipsis of the same width. A collapsed Sidebar keeps every label in its accessible name, and the
last breadcrumb is text with `aria-current` rather than a link to the page you are already on.
