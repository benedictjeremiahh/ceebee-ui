export interface PanZoomCanvasSkeletonProps {
  label?: string;
}

export function PanZoomCanvasSkeleton({ label = 'Loading canvas' }: PanZoomCanvasSkeletonProps) {
  return (
    <div className="cb-pan-zoom-canvas cb-pan-zoom-canvas--skeleton" role="status" aria-label={label}>
      <span className="cb-pan-zoom-canvas__skeleton-controls" aria-hidden="true" />
      <span className="cb-pan-zoom-canvas__skeleton-node cb-pan-zoom-canvas__skeleton-node--start" aria-hidden="true" />
      <span className="cb-pan-zoom-canvas__skeleton-line" aria-hidden="true" />
      <span className="cb-pan-zoom-canvas__skeleton-node cb-pan-zoom-canvas__skeleton-node--end" aria-hidden="true" />
    </div>
  );
}
