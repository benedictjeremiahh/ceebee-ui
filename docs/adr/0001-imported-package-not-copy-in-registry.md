# The library is an imported package, not a copy-in registry

`@ceebee/ui` is published to npm and imported. The fashionable alternative — a shadcn-style registry
that copies source into each consumer — was rejected because one person maintains this: a bug fixed
once must reach every project on `pnpm up`, which a copied file never can. Per-project visual
variance is absorbed by Skins (ADR 0002), not by forking components.

## Consequences

- A consumer that needs different markup gets a prop or a slot, and the pressure toward prop soup is
  real. When a component sprouts its fourth boolean, that is the signal to split it, not to add a
  fifth.
- The published surface is a contract. Renaming a prop is a breaking change, and Changesets exists to
  make that visible rather than silent.
