'use client';

import { Gantt, type IApi, type IColumnConfig } from '@svar-ui/react-gantt';
import { ConfigProvider } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../../lib/cn.js';
import { useMediaQuery } from '../../lib/use-media-query.js';
import { DEFAULT_SCHEDULE_LABELS } from './parts/schedule-defaults.js';
import { useScheduleScaleTitles } from './parts/use-schedule-scale-titles.js';
import { dayForGantt, dayToDate, scheduleRows } from './schedule.math.js';
import type { ResolvedScheduleLabels, ScheduleProps, ScheduleView } from './schedule.types.js';
import { ScheduleBar } from './schedule-bar.js';
import { ScheduleControls } from './schedule-controls.js';
import { ScheduleSkeleton } from './schedule.skeleton.js';
import { ScheduleCells, ScheduleNameCell, ScheduleProgressCell, ScheduleVarianceCell } from './schedule-cells.js';
import { scheduleScales } from './schedule.scales.js';
import { useScheduleGridColor } from './use-schedule-grid-color.js';
import { useScheduleFullscreen } from './use-schedule-fullscreen.js';
import { ScheduleFullscreenTools } from './schedule-fullscreen-tools.js';
import { ScheduleMobileItems } from './schedule-mobile-items.js';

/** Shared calendar geometry; the consumer owns physical facts and measurement dates. */
function ScheduleRoot({
  items,
  today,
  labels,
  editable = false,
  percentLabels = false,
  scale = 'day',
  mode = 'range',
  view,
  onViewChange,
  onItemOpen,
  fullscreen = false,
  label,
  toolbar,
  footer,
  children,
  height = 320,
  className,
}: ScheduleProps) {
  const text = useMemo<ResolvedScheduleLabels>(() => ({ ...DEFAULT_SCHEDULE_LABELS, ...labels }), [labels]);
  const narrow = useMediaQuery('(max-width: 48rem)');
  const scheduleRef = useRef<HTMLDivElement>(null);
  const presentation = useScheduleFullscreen(scheduleRef, fullscreen);
  useScheduleScaleTitles(scheduleRef, items.length > 0);
  const gridColor = useScheduleGridColor(scheduleRef, items.length > 0);
  const apiRef = useRef<IApi | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [chartMode, setChartMode] = useState({ color: '', narrow: false });
  const [localView, setLocalView] = useState<ScheduleView>({ scale, fit: mode === 'physical', left: 0, top: 0 });
  const navigation = view ?? localView;
  const liveView = useRef(navigation);
  liveView.current = navigation;
  const changeView = (next: ScheduleView) => {
    liveView.current = next;
    setLocalView(next);
    onViewChange?.(next);
  };
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const element = scheduleRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [items.length]);
  const compact = width === null ? narrow : width < (mode === 'physical' ? 760 : 680);
  const chartNarrow = chartMode.color === gridColor && chartMode.narrow;
  useEffect(() => {
    if (!mounted || !gridColor) return;
    const frame = requestAnimationFrame(() => setChartMode({ color: gridColor, narrow: compact }));
    return () => cancelAnimationFrame(frame);
  }, [mounted, compact, gridColor]);
  const rows = useMemo(() => scheduleRows(items, today, mode), [items, today, mode]);
  const rowById = useMemo(() => new Map(rows.map((row) => [row.item.id, row])), [rows]);
  const bounds = rows.reduce(
    (range, row) => ({
      start: Math.min(range.start, row.spanStart.getTime()),
      end: Math.max(range.end, row.spanEnd.getTime()),
    }),
    { start: Infinity, end: -Infinity }
  );
  const physical = mode === 'physical';
  const selectedScale = physical ? navigation.scale : scale;
  const gridWidth = chartNarrow ? 112 : physical ? 550 : 380;
  const rangeDays = (bounds.end - bounds.start) / 86400000 + 4;
  const units =
    selectedScale === 'day'
      ? rangeDays
      : selectedScale === 'week'
      ? Math.ceil(rangeDays / 7) + 1
      : Math.ceil(rangeDays / 28) + 1;
  const cellWidth =
    physical && navigation.fit
      ? Math.max(
          selectedScale === 'day' ? 44 : selectedScale === 'week' ? 70 : 100,
          Math.floor(((width ?? 1100) - gridWidth) / units)
        )
      : selectedScale === 'day'
      ? 44
      : 120;
  useEffect(() => {
    if (!physical || !width || navigation.initialized || !rows.length) return;
    const available = width - gridWidth;
    const fitScale =
      rangeDays * 44 <= available ? 'day' : (Math.ceil(rangeDays / 7) + 1) * 70 <= available ? 'week' : 'month';
    changeView({ ...navigation, scale: fitScale, initialized: true });
  }, [physical, width, navigation.initialized]);
  const axisKey = `${gridColor}:${selectedScale}:${cellWidth}:${today ?? ''}:${bounds.start}:${bounds.end}`;
  const tasks = rows.map((row) => ({
    id: row.item.id,
    text: row.item.label,
    start: dayForGantt(row.spanStart),
    end: dayForGantt(new Date(row.spanEnd.getTime() + (physical ? 86400000 : 0))),
    progress: Math.round((row.progress ?? 0) * 100),
    progressText: row.progress === null ? text.unreported : `${Math.round(row.progress * 100)}%`,
  }));

  const columns: IColumnConfig[] = physical
    ? [
        { id: 'text', header: text.item, width: 230, cell: ScheduleNameCell },
        {
          id: 'progressText',
          header: `${text.actualProgress} / ${text.plannedProgress}`,
          width: 140,
          cell: ScheduleProgressCell,
        },
        { id: 'variance', header: text.variance, width: 180, cell: ScheduleVarianceCell },
      ]
    : [
        { id: 'text', header: text.item, width: chartNarrow ? 112 : 260 },
        { id: 'progressText', header: text.actualProgress, width: 120 },
      ];

  if (rows.length === 0) return <p className={cn('cb-schedule__empty', className)}>{text.empty}</p>;
  return (
    <div ref={scheduleRef} className={cn('cb-schedule', className)} data-mode={mode}
      data-fullscreen={presentation.mode} role={fullscreen ? 'region' : undefined}
      aria-label={fullscreen ? label ?? text.item : undefined} tabIndex={fullscreen ? -1 : undefined}>
      <ConfigProvider getPopupContainer={(trigger) => scheduleRef.current ?? trigger?.parentElement ?? document.body}>
      <ScheduleFullscreenTools enabled={fullscreen} toolbar={toolbar} presentation={presentation} text={text} />
      {physical ? (
        <ScheduleControls
          api={apiRef}
          navigation={navigation}
          onChange={changeView}
          width={width}
          gridWidth={gridWidth}
          rangeDays={rangeDays}
          today={today}
          text={text}
        />
      ) : null}
      {today !== undefined ? (
        <p className="cb-schedule__today">
          <span className="cb-schedule__today-label">{text.today}</span>
          <time dateTime={today}>{text.todayDate(today)}</time>
        </p>
      ) : null}
      {compact ? <p className="cb-schedule__pan">{text.pan}</p> : null}
      <div className="cb-schedule__chart" style={{ height: presentation.mode === 'inline' ? height : undefined }} aria-busy={!mounted || !gridColor}>
        {mounted && gridColor ? (
          <ScheduleCells rows={rowById} text={text} onItemOpen={onItemOpen}>
            <Gantt
              key={axisKey}
              tasks={tasks}
              columns={columns}
              scales={scheduleScales(text, selectedScale)}
              start={physical ? dayForGantt(new Date(bounds.start)) : undefined}
              end={physical ? dayForGantt(new Date(bounds.end + 86400000)) : undefined}
              gridWidth={gridWidth}
              displayMode={chartNarrow ? 'chart' : 'all'}
              cellHeight={physical ? 72 : 40}
              cellWidth={physical ? cellWidth : undefined}
              zoom={physical ? false : undefined}
              readonly={!editable}
              init={(api) => {
                apiRef.current = api;
                const restore = liveView.current;
                let ready = !physical;
                api.on('scroll-chart', (event) => {
                  if (!ready) return;
                  const previous = liveView.current;
                  const scroller = scheduleRef.current?.querySelector('.wx-chart');
                  const maximumLeft = scroller ? scroller.scrollWidth - scroller.clientWidth : Infinity;
                  // A wider fullscreen viewport can clamp the same saved offset. That layout event must
                  // not overwrite it: returning inline restores it unless the reader actually navigates.
                  if (
                    event.left !== undefined &&
                    restore.left > maximumLeft &&
                    previous.left === restore.left &&
                    event.left === maximumLeft
                  )
                    return;
                  const next = { ...previous, left: event.left ?? previous.left, top: event.top ?? previous.top };
                  if (next.left !== previous.left || next.top !== previous.top) changeView(next);
                });
                requestAnimationFrame(() => {
                  const root = scheduleRef.current;
                  root?.removeAttribute('data-today-on-axis');
                  root?.style.removeProperty('--cb-today-x');
                  const date = today ? dayToDate(today) : null;
                  const state = api.getState();
                  const axis = state._scales;
                  if (root && date && axis && state.cellWidth && state.lengthUnit) {
                    const localDay = dayForGantt(date);
                    if (localDay >= axis.start && localDay <= axis.end) {
                      const x = axis.diff(localDay, axis.start, state.lengthUnit) * state.cellWidth;
                      if (Number.isFinite(x)) {
                        root.style.setProperty('--cb-today-x', `${x}px`);
                        root.dataset.todayOnAxis = '';
                      }
                    }
                  }
                  if (physical)
                    void api.exec('scroll-chart', { left: restore.left, top: restore.top }).then(() => {
                      ready = true;
                    });
                });
              }}
              taskTemplate={({ data }) => {
                const row = rowById.get(String(data.id));
                if (!row) return null;
                return <ScheduleBar row={row} mode={mode} labels={text} percentLabels={percentLabels} />;
              }}
            />
          </ScheduleCells>
        ) : null}
      </div>
      {compact ? <ScheduleMobileItems rows={rows} text={text} onItemOpen={onItemOpen} /> : null}
      {footer ? <div className="cb-schedule__footer">{footer}</div> : null}
      {children}
      </ConfigProvider>
    </div>
  );
}

export const Schedule = Object.assign(ScheduleRoot, { Skeleton: ScheduleSkeleton });
