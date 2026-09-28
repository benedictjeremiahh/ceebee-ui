import type { Time } from 'lightweight-charts';
import { dayOf } from '../time-series/time-series.math.js';
import type { CashFlowRow } from './cash-flow.math.js';
import type { CashFlowAnchor } from './cash-flow.detail.js';

interface PlotPoint { time: string; value: number }

export interface CashFlowPlot {
  inflow: PlotPoint[];
  outflow: PlotPoint[];
  balance: PlotPoint[];
  low: PlotPoint[];
  labels: Map<string, string>;
}

export interface CashFlowPalette {
  background: string;
  text: string;
  grid: string;
  muted: string;
  inflow: string;
  outflow: string;
  balance: string;
  font: string;
}

/** The horizontal scale is ordinal: the caller's periods may be weeks, months or repeated days. */
export function cashFlowPlot(opening: number, rows: readonly CashFlowRow[]): CashFlowPlot {
  const dayAt = (index: number) => new Date(Date.UTC(2000, 0, index + 1)).toISOString().slice(0, 10);
  const labels = new Map<string, string>();
  const balance = [{ time: dayAt(0), value: opening }];
  const inflow: PlotPoint[] = [];
  const outflow: PlotPoint[] = [];
  const low: PlotPoint[] = [];
  rows.forEach((row, index) => {
    const time = dayAt(index + 1);
    labels.set(time, row.start);
    inflow.push({ time, value: row.inflow });
    outflow.push({ time, value: -row.outflow });
    balance.push({ time, value: row.balance });
    low.push({ time, value: row.lowest });
  });
  return { inflow, outflow, balance, low, labels };
}

export interface MountedCashFlow {
  applyPalette(palette: CashFlowPalette): void;
  pointAt(index: number): CashFlowAnchor | null;
  destroy(): void;
}

/** The substrate owns the vertical scale, bars, balance line, grid, and lowest-point marker. */
export async function mountCashFlow(
  host: HTMLElement,
  plot: CashFlowPlot,
  format: (value: number) => string,
  formatPeriod: (day: string) => string,
  threshold: number,
  lowest: { index: number; value: number } | null,
  initialPalette: CashFlowPalette,
  onHover?: (index: number | null, point: CashFlowAnchor | null) => void,
): Promise<MountedCashFlow> {
  const { ColorType, HistogramSeries, LineSeries, LineStyle, createChart, createSeriesMarkers } =
    await import('lightweight-charts');
  const periodName = (time: Time) => {
    const day = plot.labels.get(dayOf(time));
    return day ? formatPeriod(day) : '';
  };
  const chart = createChart(host, {
    autoSize: true,
    handleScroll: false,
    handleScale: false,
    timeScale: { tickMarkFormatter: periodName, fixLeftEdge: true, fixRightEdge: true },
    localization: { priceFormatter: format, timeFormatter: periodName },
  });
  const common = { priceLineVisible: false, lastValueVisible: false };
  const incoming = chart.addSeries(HistogramSeries, { ...common, base: 0 });
  const outgoing = chart.addSeries(HistogramSeries, { ...common, base: 0 });
  const running = chart.addSeries(LineSeries, { ...common, lineWidth: 3 });
  const hiddenLow = chart.addSeries(LineSeries, {
    ...common, lineVisible: false, pointMarkersVisible: false, crosshairMarkerVisible: false,
  });
  incoming.setData(plot.inflow);
  outgoing.setData(plot.outflow);
  running.setData(plot.balance);
  hiddenLow.setData(plot.low);
  const lowestPoint = lowest === null ? null : plot.low[lowest.index];
  const markers = createSeriesMarkers(hiddenLow, lowestPoint && lowest ? [{
    time: lowestPoint.time, position: 'atPriceMiddle', price: lowest.value,
    shape: 'circle', color: initialPalette.balance,
  }] : []);
  running.createPriceLine({ price: threshold, color: initialPalette.muted, lineStyle: LineStyle.Dashed, axisLabelVisible: false });
  chart.timeScale().fitContent();
  // autoSize changes the canvas, but does not refit an ordinal range created at a wider width.
  const resizeObserver = new ResizeObserver(() => chart.timeScale().fitContent());
  resizeObserver.observe(host);
  const indexByTime = new Map(plot.inflow.map((point, index) => [point.time, index]));
  const pointAt = (index: number): CashFlowAnchor | null => {
    const row = plot.balance[index + 1];
    if (!row) return null;
    const x = chart.timeScale().timeToCoordinate(row.time);
    const y = running.priceToCoordinate(row.value);
    return x === null || y === null ? null : { x, y };
  };
  const handleCrosshairMove = (param: { time?: Time; point?: CashFlowAnchor }) => {
    const index = param.time === undefined ? undefined : indexByTime.get(dayOf(param.time));
    const point = index === undefined || !param.point ? null : pointAt(index);
    onHover?.(point ? index ?? null : null, point && param.point ? { x: point.x, y: param.point.y } : null);
  };
  chart.subscribeCrosshairMove(handleCrosshairMove);

  const applyPalette = (palette: CashFlowPalette) => {
    chart.applyOptions({
      layout: {
        background: { type: ColorType.Solid, color: palette.background },
        textColor: palette.text,
        fontFamily: palette.font,
        attributionLogo: false,
      },
      grid: { vertLines: { visible: false }, horzLines: { color: palette.grid } },
      rightPriceScale: { borderColor: palette.grid, scaleMargins: { top: 0.1, bottom: 0.1 } },
      timeScale: { borderColor: palette.grid },
      crosshair: { vertLine: { color: palette.muted }, horzLine: { color: palette.muted } },
    });
    incoming.applyOptions({ color: palette.inflow });
    outgoing.applyOptions({ color: palette.outflow });
    running.applyOptions({ color: palette.balance });
    markers.setMarkers(lowestPoint && lowest ? [{
      time: lowestPoint.time, position: 'atPriceMiddle', price: lowest.value,
      shape: 'circle', color: palette.balance,
    }] : []);
  };
  applyPalette(initialPalette);
  return {
    applyPalette,
    pointAt,
    destroy: () => {
      resizeObserver.disconnect();
      chart.unsubscribeCrosshairMove(handleCrosshairMove);
      chart.remove();
    },
  };
}
