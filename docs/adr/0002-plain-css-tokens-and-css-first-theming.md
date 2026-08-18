# Styling is plain CSS over custom properties, and theming happens before JavaScript runs

Components are authored in plain CSS with `cb-`-prefixed class names over CSS custom properties and published as one stylesheet
(`@ceebee/ui/styles.css`); the active Theme is selected by `data-theme` on the document root with a
`prefers-color-scheme` fallback, and a Skin is one CSS file that rewrites the skin Tokens. Tailwind
was rejected because it would force every future consumer onto Tailwind and onto a `@source` line
pointing into `node_modules`, and CSS-in-JS was rejected because it makes every themed component a
Client Component and paints the wrong colours until hydration.

## Consequences

- The board look (glass, gradients, tinted cards) lives in `Surface` variants and a Skin, so the
  library can dress a very different product without being fought.
- Plain prefixed CSS beats CSS Modules here: a published package must ship compiled CSS anyway, so
  hashed class names would add build machinery and cost consumers the ability to target a class.
- Runtime user-chosen colour is still possible later: JavaScript writes a value into a CSS custom
  property, and the Tokens stay in CSS.
