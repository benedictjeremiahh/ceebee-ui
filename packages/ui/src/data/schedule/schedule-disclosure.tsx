import type { ResolvedScheduleLabels } from './schedule.types.js';

/** The one control that opens and closes a parent's children: pointer, keyboard and screen reader alike. */
export function ScheduleDisclosure({ label, count, open, text, onToggle }: {
  label: string;
  count: number;
  open: boolean;
  text: ResolvedScheduleLabels;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="cb-schedule__disclosure"
      aria-expanded={open}
      aria-label={`${open ? text.collapseItems : text.expandItems}: ${label} (${count})`}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
    >
      <span className="cb-schedule__chevron" aria-hidden="true" />
      <span className="cb-schedule__count">{count}</span>
    </button>
  );
}
