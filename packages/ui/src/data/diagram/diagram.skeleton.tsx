import { PanZoomCanvasSkeleton } from '../pan-zoom-canvas/pan-zoom-canvas.skeleton.js';

export interface DiagramSkeletonProps {
  label?: string;
}

/* A diagram is laid out inside a PanZoomCanvas, so its loading state is the canvas's: the same toolbar and
   viewport geometry, with placeholder nodes joined by a line. Positions are not known before load, so no
   node-shaped placeholder is drawn at a position it may not have. */
export function DiagramSkeleton({ label = 'Loading diagram' }: DiagramSkeletonProps) {
  return <PanZoomCanvasSkeleton label={label} />;
}
