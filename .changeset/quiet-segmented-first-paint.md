---
"@ceebee/ui": patch
---

Hide Segmented's native radio input in the token-based pre-paint fallback so a first request without
a persisted theme remains visually identical until Ant's runtime stylesheet arrives.
