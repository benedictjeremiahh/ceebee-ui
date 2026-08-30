---
"@ceebee/ui": patch
---

Give each sticker an angle that belongs to it. Deriving the tilt from the array index meant dismissing one sticker re-tilted every sticker after it, so the collection appeared to rearrange itself in response to a dismissal it had nothing to do with.
