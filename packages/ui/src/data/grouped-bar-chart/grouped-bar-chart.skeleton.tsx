export function GroupedBarChartSkeleton({ height = 180, label = 'Loading readings' }: { height?: number; label?: string }) {
  return <div className="cb-grouped-bars cb-grouped-bars--skeleton" role="status" aria-label={label}>
    <div className="cb-grouped-bars__legend" aria-hidden="true"><span className="cb-grouped-bars__skeleton-fill" /></div>
    <div className="cb-grouped-bars__plot cb-grouped-bars__skeleton-fill" style={{ height }} aria-hidden="true" />
    <div className="cb-grouped-bars__category" aria-hidden="true">&nbsp;</div>
  </div>;
}
