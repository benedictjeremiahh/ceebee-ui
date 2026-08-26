# Ant Design is a reference, not a runtime dependency

Ant Design's base and Pro component catalogs define the breadth, established names, and use cases
that `@ceebee/ui` accounts for, but they do not define a compatibility target. The library keeps its
own public APIs, Tokens, Skins, Base UI behaviour, interaction-contract boundaries, and injected
adapters; it neither depends on `antd` or `@ant-design/pro-components` nor reproduces their props by
default. Every catalog entry must still appear in the roadmap as built, planned, replaced, or
deliberately absent, so deviations are decisions rather than omissions.

## Consequences

- A person familiar with Ant can discover the corresponding Ceebee capability by name and catalog
  position without expecting drop-in source compatibility.
- Pro use cases are covered by either exported Ceebee components or docs-only Recipes. Reusable
  interaction and layout contracts belong in the package; application workflows that own fetching,
  routing, auth, persistence, or form state belong in Recipes unless separately reconsidered.
- Pro coverage is tracked by documented component family. Compound parts, specialised forms, and
  visual or workflow variants are nested under their parent family instead of inflating the roadmap
  as independent component contracts.
- New Ant catalog entries are reviewed and classified; they are not automatically dependencies or
  implementation commitments.
- Coverage claims name an audited Ant version and Pro catalog date. Later upstream additions enter
  through an explicit audit rather than silently changing an already agreed roadmap.
