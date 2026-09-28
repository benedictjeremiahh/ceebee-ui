import { Button, Tooltip } from 'antd';
import { createContext, useContext, type ComponentProps, type ReactNode } from 'react';
import type { IColumnConfig } from '@svar-ui/react-gantt';
import type { ScheduleRow } from './schedule.math.js';
import type { ResolvedScheduleLabels } from './schedule.types.js';

type CellProps = Pick<ComponentProps<NonNullable<IColumnConfig['cell']>>, 'row'>;
interface CellContext {
  rows: ReadonlyMap<string, ScheduleRow>;
  text: ResolvedScheduleLabels;
  onItemOpen?: (id: string) => void;
}
const Context = createContext<CellContext | null>(null);

/** Stable cell identities keep keyboard focus intact during scroll-state updates. */
export function ScheduleCells({ children, ...value }: CellContext & { children: ReactNode }) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function ScheduleNameCell({ row }: CellProps) {
  const context = useContext(Context);
  const item = context?.rows.get(String(row.id))?.item;
  if (!item || !context) return null;
  return (
    <div className="cb-schedule__identity">
      <Tooltip title={item.label}>
        <span className="cb-schedule__name">{item.label}</span>
      </Tooltip>
      {context.onItemOpen ? (
        <Button
          type="link"
          size="small"
          aria-label={`${context.text.details}: ${item.label}`}
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            context.onItemOpen?.(item.id);
          }}
        >
          {context.text.details}
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
