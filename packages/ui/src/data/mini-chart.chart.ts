import type { MiniChartPoint } from './mini-chart.math.js';

export interface MiniChartAppearance {
  accent: string;
  background: string;
}

export interface MountedMiniChart {
  applyAppearance(appearance: MiniChartAppearance): void;
  destroy(): void;
}

/** Lightweight Charts owns the plots and their scales; this only chooses the mini-chart series. */
export async function mountMiniChart(
  host: HTMLElement,
  points: MiniChartPoint[],
  kind: 'line' | 'area' | 'bar',
  width: number | '100%',
  height: number,
  showLast: boolean,
  initialAppearance: MiniChartAppearance,
): Promise<MountedMiniChart> {
  const { AreaSeries, ColorType, HistogramSeries, LineSeries, createChart, createSeriesMarkers } =
    await import('lightweight-charts');
  const responsive = width === '100%';
  const chart = createChart(host, {
    width: responsive ? host.clientWidth : width,
    height,
    autoSize: responsive,
    handleScroll: false,
    handleScale: false,
    grid: { vertLines: { visible: false }, horzLines: { visible: false } },
    crosshair: { vertLine: { visible: false }, horzLine: { visible: false } },
    leftPriceScale: { visible: false },
    rightPriceScale: { visible: false, scaleMargins: { top: 0.12, bottom: 0.12 } },
    timeScale: { visible: false, fixLeftEdge: true, fixRightEdge: true },
    layout: { attributionLogo: false },
  });
  const common = { priceLineVisible: false, lastValueVisible: false };
  const resizeObserver = responsive ? new ResizeObserver(() => chart.timeScale().fitContent()) : null;
  resizeObserver?.observe(host);
  const destroy = () => {
    resizeObserver?.disconnect();
    chart.remove();
  };
  const applyBackground = (appearance: MiniChartAppearance) => chart.applyOptions({
    layout: { background: { type: ColorType.Solid, color: appearance.background }, attributionLogo: false },
  });
  if (kind === 'bar') {
    const series = chart.addSeries(HistogramSeries, { ...common, base: 0, color: initialAppearance.accent });
    series.setData(points.map((point) => ({ ...point, value: Math.max(0, point.value) })));
    chart.timeScale().fitContent();
    const applyAppearance = (appearance: MiniChartAppearance) => {
      applyBackground(appearance);
      series.applyOptions({ color: appearance.accent });
    };
    applyAppearance(initialAppearance);
    return { applyAppearance, destroy };
  }
  const series = kind === 'area'
    ? chart.addSeries(AreaSeries, {
      ...common, lineColor: initialAppearance.accent, topColor: initialAppearance.accent,
      bottomColor: initialAppearance.background, lineWidth: 2,
    })
    : chart.addSeries(LineSeries, { ...common, color: initialAppearance.accent, lineWidth: 2 });
  series.setData(points);
  const last = points.at(-1);
  const marker = createSeriesMarkers(series, (showLast || points.length === 1) && last ? [{
    time: last.time, position: 'atPriceMiddle', price: last.value, shape: 'circle', color: initialAppearance.accent,
  }] : []);
  chart.timeScale().fitContent();
  const applyAppearance = (appearance: MiniChartAppearance) => {
    applyBackground(appearance);
    if (kind === 'area') {
      series.applyOptions({ lineColor: appearance.accent, topColor: appearance.accent, bottomColor: appearance.background });
    } else {
      series.applyOptions({ color: appearance.accent });
    }
    marker.setMarkers((showLast || points.length === 1) && last ? [{
      time: last.time, position: 'atPriceMiddle', price: last.value, shape: 'circle', color: appearance.accent,
    }] : []);
  };
  applyAppearance(initialAppearance);
  return { applyAppearance, destroy };
}
