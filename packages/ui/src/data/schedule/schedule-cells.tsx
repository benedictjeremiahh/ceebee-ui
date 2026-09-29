import { Button, Tooltip } from 'antd';
import { createContext, useContext, type ComponentProps, type ReactNode } from 'react';
import type { IColumnConfig } from '@svar-ui/react-gantt';
import type { ScheduleRow } from './schedule.math.js';
import type { ResolvedScheduleLabels, ScheduleEntry } from './schedule.types.js';
import { isUnscheduled, type ScheduleHierarchy } from './schedule.hierarchy.js';
import { ScheduleDisclosure } from './schedule-disclosure.js';

type CellProps = Pick<ComponentProps<NonNullable<IColumnConfig['cell']>>, 'row'>;
interface CellContext {
  rows: ReadonlyMap<string, ScheduleRow>;
  text: ResolvedScheduleLabels;
  onItemOpen?: (id: string) => void;
  onChildOpen?: (id: string) => void;
  items: ReadonlyMap<string, ScheduleEntry>;
  hierarchy: ScheduleHierarchy;
  expanded: ReadonlySet<string>;
  onToggle: (id: string) => void;
}
const Context = createContext<CellContext | null>(null);

/** Stable cell identities keep keyboard focus intact during scroll-state updates. */
export function ScheduleCells({ children, ...value }: CellContext & { children: ReactNode }) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function ScheduleNameCell({ row }: CellProps) {
  const context = useContext(Context);
  const item = context?.items.get(String(row.id));
  if (!item || !context) return null;
  const { hierarchy, text } = context;
  const children = hierarchy.childCount.get(item.id) ?? 0;
  const dated = hierarchy.datedCount.get(item.id) ?? 0;
  const child = (hierarchy.depth.get(item.id) ?? 0) > 0;
  return (
    <div className="cb-schedule__identity" data-depth={hierarchy.depth.get(item.id) ?? 0}>
      <div className="cb-schedule__title">
        {children > 0 ? (
          <ScheduleDisclosure label={item.label} count={children} open={context.expanded.has(item.id)}
            text={text} onToggle={() => context.onToggle(item.id)} />
        ) : null}
        <Tooltip title={item.label}>
          {child && context.onChildOpen ? (
            <button
              type="button"
              className="cb-schedule__name cb-schedule__name-action"
              aria-label={`${text.details}: ${item.label}`}
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                context.onChildOpen?.(item.id);
              }}
            >
              {item.label}
            </button>
          ) : (
            <span className="cb-schedule__name">{item.label}</span>
          )}
        </Tooltip>
      </div>
      {isUnscheduled(item) ? <span className="cb-schedule__note">{text.unscheduled}</span> : null}
      {dated < children ? <span className="cb-schedule__note">{text.partialCoverage(dated, children)}</span> : null}
      {context.onItemOpen && !child ? (
        <Button
          type="link"
          size="small"
          aria-label={`${text.details}: ${item.label}`}
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            context.onItemOpen?.(item.id);
          }}
        >
          {text.details}
        </Button>
      ) : null}
    </div>
  );
}

export function ScheduleProgressCell({ row }: CellProps) {
  const context = useContext(Context);
  const reading = context?.rows.get(String(row.id));
  if (!reading || !context) return null;
  return (
    <div className="cb-schedule__reading">
      <strong>
        {reading.progress === null ? context.text.unreported : context.text.percent(reading.progress * 100)}
      </strong>
      <span>
        {context.text.plannedProgress}{' '}
        {reading.item.plannedProgress === undefined ? '—' : context.text.percent(reading.item.plannedProgress * 100)}
      </span>
    </div>
  );
}

export function ScheduleVarianceCell({ row }: CellProps) {
  const context = useContext(Context);
  const reading = context?.rows.get(String(row.id));
  if (!reading || !context) return null;
  const gap =
    reading.progress !== null && reading.item.plannedProgress !== undefined
      ? (reading.progress - reading.item.plannedProgress) * 100
      : null;
  return (
    <div className="cb-schedule__reading">
      <span data-negative={gap !== null && gap < -0.05 ? '' : undefined}>
        {gap === null ? '—' : context.text.gap(gap)}
      </span>
      {(reading.item.latenessDays ?? 0) > 0 ? (
        <strong data-negative="">{context.text.lateDays(reading.item.latenessDays ?? 0)}</strong>
      ) : null}
    </div>
  );
}
