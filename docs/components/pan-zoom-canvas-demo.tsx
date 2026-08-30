'use client';

import { PanZoomCanvas } from '@ceebee/ui/client';
import { Demo } from './demo';

export function PanZoomCanvasDemo() {
  return (
    <Demo
      layout="block"
      code={`<PanZoomCanvas
  label="Product relationships"
  hint="Drag to pan. Pinch or use the controls to zoom."
>
  <RelationshipMap />
</PanZoomCanvas>`}
    >
      <PanZoomCanvas
        label="Product relationships"
        hint="Drag to pan. Pinch or use the controls to zoom."
      >
        <div className="docs__canvas-example">
          <a href="#idea">Product idea</a>
          <span aria-hidden="true" />
          <a href="#decision">Decision note</a>
        </div>
      </PanZoomCanvas>
    </Demo>
  );
}
