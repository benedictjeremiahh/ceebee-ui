import type { Time } from 'lightweight-charts';
import { dayOf, niceRange, valueSpan, type SeriesPoint } from './time-series.math.js';
import type { Baseline, ChartPalette, SeriesSpec, ValueRange } from './time-series.types.js';

/**
 * The canvas half of every dated chart in this library, kept out of the components.
 *
 * Everything here is imperative and unobservable: a canvas has no DOM, so nothing below can be
 * asserted from a test that renders a component. That is precisely why it is one file — what *can* be
 * wrong lives in `time-series.math.ts` and is spec'd there, and this is confined to wiring the
 * substrate up and handing it values that were already decided. It exists once rather than once per
 * chart because this is the subtle part: three defects have been found in it, and a second copy would
 * have carried whichever two were fixed last.
 */

export interface MountedChart {
  setData(series: readonly { points: readonly SeriesPoint[] }[]): void;
  mark(day: string | null, text: string): void;
  applyPalette(palette: ChartPalette): void;
  destroy(): void;
}

export interface ChartShape {
  series: readonly SeriesSpec[];
  format: (value: number) => string;
  /** A tick's day in the product's words. Omitted, the substrate's own English date stands. */
  tickMark?: (day: string) => string;
  range?: ValueRange;
  baseline?: Baseline;
}

/**
 * Loads the substrate and draws an empty chart into `host`.
 *
 * The import is dynamic for two reasons that both matter to this product: the module touches the DOM,
 * so a server render must never evaluate it, and a consumer who never shows a chart should not pay for
 * it over a phone connection.
 */
export async function mountTimeSeries(
  host: HTMLElement,
  shape: ChartShape,
  palette: ChartPalette,
): Promise<MountedChart> {
  const { BaselineSeries, ColorType, LineSeries, LineStyle, createChart, createSeriesMarkers } =
    await import('lightweight-charts');

  const chart = createChart(host, {
    autoSize: true,
    /* A dashboard chart is read, not traded. Panning and zooming would let somebody scroll the data
       off the screen and leave them looking at a fragment with no way back, so the whole span is
       fitted and the viewport is fixed. */
    handleScroll: false,
    handleScale: false,
    /* The axis names its days in the product's words rather than ISO, and in the product's language
       (issue #26). The substrate holds a tick's time as one of three shapes, so it is read through
       `dayOf` rather than assumed. */
    ...(shape.tickMark
      ? { timeScale: { tickMarkFormatter: (time: Time) => shape.tickMark?.(dayOf(time)) } }
      : {}),
  });

  /* The axis is rounded outwards to 1, 2 or 5 times a power of ten (issue #26). Autoscaling to the data's
     own extremes is what hands a compact formatter a `97` it answers with `97,0` — a decimal that exists
     only because the last reading happened to land there. A pinned range still wins: a percentage chart
     that states 0–100 is saying something a rounded autoscale would talk over. */
  const span = valueSpan(shape.series, shape.baseline?.value);
  const rounded = span ? niceRange(span.min, span.max) : null;
  const scale = shape.range
    ? () => ({ priceRange: { minValue: shape.range?.min ?? 0, maxValue: shape.range?.max ?? 0 } })
    : rounded
      ? () => ({ priceRange: { minValue: rounded.min, maxValue: rounded.max } })
      : undefined;
  const common = { priceLineVisible: false, lastValueVisible: false, autoscaleInfoProvider: scale };

  /* A baseline chart is one series read against a value, shaded above and below it; a line chart is any
     number of series read against each other. They are different questions, so the substrate series
     differs — but the palette, the marker, the axes and the accessible rendering are identical, which
     is why they share this file rather than a component each. */
  const drawn = shape.baseline
    ? [
        chart.addSeries(BaselineSeries, {
          ...common,
          baseValue: { type: 'price', price: shape.baseline.value },
          lineWidth: 2,
        }),
      ]
    : shape.series.map((series) =>
        chart.addSeries(LineSeries, {
          ...common,
          lineWidth: series.emphasis === 'reference' ? 2 : 3,
          lineStyle: series.emphasis === 'reference' ? LineStyle.Dashed : LineStyle.Solid,
        }),
      );
  /* The mark hangs on the last series, which is the primary one by convention — a reference line is
     drawn first. `at(-1)` can be undefined to the compiler, and there is genuinely nothing to mark on
     a chart with no series, so the marker plugin is created only when there is one to attach to. */
  const markedSeries = drawn.at(-1);
  const markers = markedSeries ? createSeriesMarkers(markedSeries, []) : null;

  let current = palette;
  const apply = (next: ChartPalette) => {
    current = next;
    chart.applyOptions({
      layout: {
        background: { type: ColorType.Solid, color: next.background },
        textColor: next.text,
        fontFamily: next.font,
        /* Apache-2.0 asks that the NOTICE travel with the distribution, not that a logo be painted
           into a consumer's dashboard. The attribution lives in THIRD_PARTY_NOTICES.md. */
        attributionLogo: false,
      },
      grid: { vertLines: { color: next.grid }, horzLines: { color: next.grid } },
      rightPriceScale: { borderColor: next.grid, scaleMargins: { top: 0.1, bottom: 0.08 } },
      timeScale: { borderColor: next.grid, fixLeftEdge: true, fixRightEdge: true },
      crosshair: { vertLine: { color: next.muted }, horzLine: { color: next.muted } },
      localization: { priceFormatter: shape.format },
    });
    drawn.forEach((series, index) => {
      if (shape.baseline) {
        series.applyOptions({
          topLineColor: next.above,
          topFillColor1: next.above,
          topFillColor2: next.background,
          bottomLineColor: next.below,
          bottomFillColor1: next.background,
          bottomFillColor2: next.below,
          crosshairMarkerBorderColor: next.background,
        });
        return;
      }
      series.applyOptions({
        color: next.series[index] ?? next.text,
        crosshairMarkerBorderColor: next.background,
      });
    });
  };
  apply(palette);

  return {
    setData(series) {
      drawn.forEach((drawnSeries, index) => {
        const points = series[index]?.points ?? [];
        drawnSeries.setData(points.map((point) => ({ time: point.day, value: point.value })));
      });
      chart.timeScale().fitContent();
    },
    mark(day, text) {
      /* Below the point, not above: above is where a reference line runs whenever the measure is
         behind it, which is the case anybody reads the chart for. */
      markers?.setMarkers(day === null ? [] : [{
        time: day,
        position: 'belowBar',
        shape: 'arrowUp',
        color: current.series[current.series.length - 1] ?? current.text,
        text,
      }]);
    },
    applyPalette: apply,
    destroy() {
      chart.remove();
    },
  };
}
