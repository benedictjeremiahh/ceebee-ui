# Every Composition ships a Skeleton built from its own geometry

Shape Atoms (`Skeleton.Text`, `.Circle`, `.Rect`) cover free-form cases, but each Composition also
exposes `X.Skeleton` derived from the same spacing and sizing Tokens as `X` itself, so the
placeholder cannot drift from the content that replaces it. An automatic `<Skeletonize>` wrapper
that infers shapes from children was rejected: it guesses wrong on real layouts and is nearly
undebuggable when it does.

## Consequences

- Adding a Composition means adding its Skeleton in the same change; the authoring contract treats a
  missing one as an incomplete component.
- The shimmer is CSS and stops under `prefers-reduced-motion`.
