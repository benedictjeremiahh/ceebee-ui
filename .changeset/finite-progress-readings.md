---
"@ceebee/ui": patch
---

Stop carrying actual progress into later planned dates in the accessible chart table. Preserve the latest summary, reported zero and values between reports. Generic dated series retain their existing carry-forward default and can opt out with `extendLastValue: false`.
