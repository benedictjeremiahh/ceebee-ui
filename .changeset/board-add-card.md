---
"@ceebee/ui": minor
---

`Board` takes `onAddCard(columnId)`: every column that accepts cards then shows a footer action named for that column ("Add a card to Doing"), so work is added where a person is looking instead of from a toolbar that asks the destination again. A column with `accepts: false` never offers it. `Board.Skeleton` takes `addCard` so the placeholder matches the board's height.
