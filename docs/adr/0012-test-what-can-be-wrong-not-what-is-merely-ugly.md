# We test what can be wrong, not what is merely ugly

Vitest and Testing Library cover behaviour that can be incorrect: carousel index and loop maths,
Coachmark focus trapping and dismissal, Tour step sequencing, reduced-motion renderings, Token
resolution, Skeleton geometry, and accessible naming. CSS values and matters of taste are not
asserted — the docs site is where those are judged, and snapshotting them produces tests that fail
for the wrong reasons.

## Consequences

- Visual regression (Playwright) and axe assertions are deliberately deferred, not rejected; the day
  someone other than the author consumes this library is the day to add them.
