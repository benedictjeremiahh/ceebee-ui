import type { ScheduleRow } from './schedule.math.js';
import { Tooltip } from 'antd';
import type { ResolvedScheduleLabels } from './schedule.types.js';

/** Geometry comes from validated calendar rows, never loosely typed substrate fields. */
export function ScheduleBar({
  row,
  mode,
  description,
  labels,
  percentLabels = false,
  coverage,
}: {
  row: ScheduleRow;
  mode: 'range' | 'physical';
  description?: string;
  labels?: ResolvedScheduleLabels;
  percentLabels?: boolean;
  /** Set when only some of the row's children carry dates: its range does not cover them all. */
  coverage?: string;
}) {
  const percent = Math.round((row.progress ?? 0) * 100);
  const physical = mode === 'physical';
  const fill = physical ? row.planned.width * (row.progress ?? 0) : percent;
  const words = labels
    ? [
        row.item.label,
        row.progress === null ? labels.unreported : labels.progress(percent),
        coverage,
        physical && row.item.reportedOn
          ? labels.report(row.item.reportedOn)
          : !physical && row.item.actual
          ? labels.actual(row.item.actual.start, row.item.actual.end)
          : null,
        physical && row.item.latenessDays
          ? labels.lateDays(row.item.latenessDays)
          : !physical && row.late
          ? labels.late
          : null,
      ]
        .filter(Boolean)
        .join(', ')
    : row.item.label;
  const accessibleName = description ?? words;
  return (
    <Tooltip title={accessibleName}>
      <span
        className="cb-schedule__bar"
        data-mode={mode}
        data-late={row.late ? '' : undefined}
        data-overran={row.overran ? '' : undefined}
        data-actual={row.actual ? '' : undefined}
        data-unreported={row.progress === null ? '' : undefined}
        data-partial={coverage ? '' : undefined}
        role="img"
        aria-label={accessibleName}
      >
        <span
          className="cb-schedule__bar-planned"
          style={{ insetInlineStart: `${row.planned.left}%`, inlineSize: `${row.planned.width}%` }}
        />
        {!physical && row.actual ? (
          <span
            className="cb-schedule__bar-actual"
            style={{ insetInlineStart: `${row.actual.left}%`, inlineSize: `${row.actual.width}%` }}
          />
        ) : row.progress !== null ? (
          <span
            className="cb-schedule__bar-fill"
            style={{ insetInlineStart: `${physical ? row.planned.left : 0}%`, inlineSize: `${fill}%` }}
          />
        ) : null}
        {physical && row.reportedAt !== null ? (
          <span className="cb-schedule__bar-report" style={{ insetInlineStart: `${row.reportedAt}%` }} />
        ) : null}
        {percentLabels && row.progress !== null ? (
          <span
            className="cb-schedule__bar-percent"
            style={{
              insetInlineStart: `min(calc(${
                physical ? row.planned.left + fill : row.actual ? row.actual.left + row.actual.width : percent
              }% + var(--cb-space-1)), calc(100% - 2.5em))`,
            }}
          >
            {percent}%
          </span>
        ) : null}
      </span>
    </Tooltip>
  );
}
