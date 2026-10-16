'use client';

import { lazy, Suspense, useEffect, useState } from 'react';
import { OrgChartSkeleton } from './org-chart.skeleton.js';
import type { OrgChartProps } from './org-chart.types.js';
import './org-chart.css';

const OrgChartTree = lazy(() => import('./org-chart-tree.js').then((module) => ({ default: module.OrgChartTree })));

function OrgChartRoot({ nodes, label, loadingLabel, getCountLabel = (count) => `${count} direct reports`,
  getToggleLabel = (node, expanded) => `${expanded ? 'Collapse' : 'Expand'} ${node.name}` }: OrgChartProps) {
  const [mounted, setMounted] = useState(false);
  const [collapsedIds, setCollapsedIds] = useState<ReadonlySet<string>>(() => new Set());
  useEffect(() => setMounted(true), []);

  function toggle(id: string) {
    setCollapsedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return <div className="cb-org-chart">
    <div className="cb-org-chart__viewport" role="region" tabIndex={0} aria-label={label}>
      {mounted ? <Suspense fallback={<OrgChartSkeleton label={loadingLabel} />}>
        <OrgChartTree nodes={nodes} collapsedIds={collapsedIds} onToggle={toggle}
          getCountLabel={getCountLabel} getToggleLabel={getToggleLabel} />
      </Suspense> : <OrgChartSkeleton label={loadingLabel} />}
    </div>
  </div>;
}

export const OrgChart = Object.assign(OrgChartRoot, { Skeleton: OrgChartSkeleton });
export { OrgChartSkeleton };
