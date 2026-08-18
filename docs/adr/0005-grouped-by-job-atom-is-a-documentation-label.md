# Components are grouped by the job they do; "atom" and "composition" are documentation labels only

Folders are `form/`, `data/`, `feedback/`, `overlay/`, `nav/`, `media/`, `motion/`, `onboarding/` —
not `atoms/`, `molecules/`, `organisms/`, and not one flat list. Atomic-design folders were rejected
because promoting a component between tiers changes its import path for a reason nobody outside the
library cares about, and a flat list was rejected because the navigation becomes a wall of text
around the fortieth component.

## Consequences

- The docs site still sorts by Atom and Composition, because that is a useful way to read a library —
  it is just not a useful way to store one.
