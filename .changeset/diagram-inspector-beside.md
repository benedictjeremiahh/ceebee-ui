---
"@ceebee/ui": patch
---

`DiagramEditor`'s inspector sits beside the canvas when there is room, as `renderInspector` has claimed since it shipped (ceebee-ui#24). The editor's body was both the size container and the element its `@container` rule targeted, and an element cannot query its own size — so the rule never matched and the inspector stayed under the canvas at every width. The editor itself is the container now.
