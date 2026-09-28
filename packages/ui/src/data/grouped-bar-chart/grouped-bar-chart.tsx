'use client';

import { Tooltip } from 'antd';
import { cn, type Tone } from '../../lib/cn.js';
import { GroupedBarChartSkeleton } from './grouped-bar-chart.skeleton.js';

export interface BarGroup {
  id: string;
  label: string;
  values: Readonly<Record<string, number | null>>;
}
export interface BarGroupSeries { key: string; label: string; tone?: Tone }
export interface GroupedBarChartProps {
  label: string;
  groups: readonly BarGroup[];
  series: readonly BarGroupSeries[];
  format: (value: number) => string;
  formatExact?: (value: number) => string;
  height?: number;
  unknownLabel?: string;
  emptyLabel?: string;
  tableLabel?: string;
  className?: string;
}

function reading(value: number | null | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
}

/** Discrete category totals on one zero-based scale; never a trend or a derived running balance. */
function GroupedBarChartRoot({ label, groups, series, format, formatExact = format, height = 180,
  unknownLabel = 'Unknown', emptyLabel = 'No readings', tableLabel = label, className }: GroupedBarChartProps) {
  const maximum = Math.max(0, ...groups.flatMap((group) => series.map((one) => reading(group.values[one.key]) ?? 0)));
  const written = (group: BarGroup, key: string) => {
    const value = reading(group.values[key]);
    return value === null ? unknownLabel : formatExact(value);
  };
  if (groups.length === 0 || series.length === 0) return <p className="cb-grouped-bars__empty">{emptyLabel}</p>;
  return <figure className={cn('cb-grouped-bars', className)} aria-label={label}>
    <ul className="cb-grouped-bars__legend" aria-label={label}>
      {series.map((one) => <li key={one.key} data-tone={one.tone ?? 'brand'}>{one.label}</li>)}
    </ul>
    <div className="cb-grouped-bars__plot">
      <div className="cb-grouped-bars__scale" style={{ height }} aria-hidden="true">
        <span>{format(maximum)}</span><span>{format(maximum / 2)}</span><span>{format(0)}</span>
      </div>
      <div className="cb-grouped-bars__groups">
        {groups.map((group) => <Tooltip key={group.id} trigger={['hover', 'focus']}
          styles={{ root: { maxWidth: 'calc(var(--cb-space-6) * 12)' } }} title={
          <div><strong>{group.label}</strong><dl className="cb-grouped-bars__detail">
            {series.map((one) => <div key={one.key}><dt>{one.label}</dt><dd>{written(group, one.key)}</dd></div>)}
          </dl></div>
        }>
          <div className="cb-grouped-bars__group" role="img" tabIndex={0}
            aria-label={`${group.label}: ${series.map((one) => `${one.label} ${written(group, one.key)}`).join(', ')}`}>
            <div className="cb-grouped-bars__columns" style={{ height }} aria-hidden="true">
              {series.map((one) => <span key={one.key} className="cb-grouped-bars__bar" data-tone={one.tone ?? 'brand'}
                data-unknown={reading(group.values[one.key]) === null || undefined}
                style={{ height: `${maximum === 0 ? 0 : (reading(group.values[one.key]) ?? 0) / maximum * 100}%` }} />)}
            </div>
            <span className="cb-grouped-bars__category" aria-hidden="true">{group.label}</span>
          </div>
        </Tooltip>)}
      </div>
    </div>
    <div className="cb-grouped-bars__rows"><table>
      <caption>{tableLabel}</caption>
      <thead><tr><th scope="col">{label}</th>{series.map((one) => <th key={one.key} scope="col">{one.label}</th>)}</tr></thead>
      <tbody>{groups.map((group) => <tr key={group.id}><th scope="row">{group.label}</th>{series.map((one) => <td key={one.key}>{written(group, one.key)}</td>)}</tr>)}</tbody>
    </table></div>
  </figure>;
}

export const GroupedBarChart = Object.assign(GroupedBarChartRoot, { Skeleton: GroupedBarChartSkeleton });
