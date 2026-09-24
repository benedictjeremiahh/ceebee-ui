---
"@ceebee/ui": patch
---

A card's title, when `onCardOpen` makes it a control, takes the 24px control floor rather than the one pixel under it a line box lands on — the card title is the only way to open a card, and it measured 23px. The drag handle takes the same floor.
