---
"@ceebee/ui": minor
---

Board cards can be opened without a button on the front. Pass `onCardOpen` and the card's **title** becomes the open affordance — click it, or focus it and press Enter or Space — so a card front can be a title and badges rather than a row of action buttons.

The open lives on the title, not the whole card, for the same reason `handle` exists: a card that is itself a control has presentational children, so a `meta` button inside it would leave the accessibility tree. Enter and Space are taken by the open button and stopped from reaching the card's move path, so one press never opens *and* picks a card up. A card with no `onCardOpen` is unchanged.
