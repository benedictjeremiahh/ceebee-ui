# The library owns Fields and refuses to own forms

`Field` plus the input primitives handle labels, hints, errors, and the `aria-describedby` /
`aria-invalid` wiring between them — the part that is most often silently wrong — and stop there.
There is no validation engine and no `<Form>` holding state, so the library works unchanged with
react-hook-form, TanStack Form, or Next Server Actions.

## Consequences

- Field-array-driven CRUD forms (the pattern that is right in an ERP) are not offered here; an app
  that wants one builds it on these primitives.
