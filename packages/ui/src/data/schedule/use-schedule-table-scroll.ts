import { useEffect, type RefObject } from 'react';

/** The public Gantt API surface needed to reconcile the table's incidental focus scroll. */
export interface ScheduleTableScrollApi {
  getState: () => { scrollTop: number };
  exec: (action: 'scroll-chart', params: { top: number }) => Promise<unknown>;
}

/** Keeps browser focus scrolling in SVAR's table panel aligned with its shared chart scroll. */
export function useScheduleTableScroll(
  rootRef: RefObject<HTMLDivElement | null>,
  apiRef: RefObject<ScheduleTableScrollApi | null>,
  enabled: boolean,
): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;

    const reconcile = (event: Event) => {
      const table = event.target;
      if (
        !(table instanceof HTMLElement) ||
        !table.matches('.wx-table-container') ||
        table.scrollTop <= 0 ||
        !root.isConnected ||
        rootRef.current !== root
      )
        return;

      const api = apiRef.current;
      if (!api) return;

      const incidentalTop = table.scrollTop;
      const currentTop = api.getState().scrollTop;
      table.scrollTop = 0;
      void api.exec('scroll-chart', { top: currentTop + incidentalTop });
    };

    root.addEventListener('scroll', reconcile, true);
    return () => root.removeEventListener('scroll', reconcile, true);
  }, [apiRef, enabled, rootRef]);
}
