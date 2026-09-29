---
'@ceebee/ui': patch
---

DiagramEditor: clicking a connection now puts it in the inspector. Edges are controlled by the caller and were never marked selected in the runtime's own state, so a selection change never reported one and the inspector could only ever describe nodes.
