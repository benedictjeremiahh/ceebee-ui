export function OrgChartSkeleton({ label = 'Loading organization chart' }: { label?: string }) {
  return <div className="cb-org-chart__skeleton" role="status" aria-label={label}>
    <span /><span /><span />
  </div>;
}
