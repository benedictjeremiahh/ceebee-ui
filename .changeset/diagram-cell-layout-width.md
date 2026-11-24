---
"@ceebee/ui": patch
---

Diagram and DiagramEditor read the grid cell from its layout width instead of its on-screen box. A diagram that mounted while an opening Modal was still zooming measured the scaled cell, so nodes were placed too close together and overlapped while keeping their full size. The cell is also re-read when its Token changes after mount.
