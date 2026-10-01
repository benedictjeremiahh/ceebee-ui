---
"@ceebee/ui": patch
---

Form help text (`Form.Item extra`, and other text Ant draws in `colorTextDescription`) takes the muted foreground, so it reads at WCAG AA on every surface — it measured 4.35:1 on the subtle card surface. The server-rendered seeds now also carry `colorTextDisabled`, which the runtime theme already sent.
