import type { CurvePoint } from './progress-curve.math.js';
import type { CurvePalette } from './progress-curve.types.js';

/**
 * The canvas half of ProgressCurve, kept out of the component.
 *
 * Everything here is imperative and unobservable: a canvas has no DOM, so nothing below can be
 * asserted from a test that renders the component. That is precisely why it is a separate file —
 * what *can* be wrong lives in `progress-curve.math.ts` and is spec'd there, and this file is
 * confined to wiring the substrate up and handing it values that were already decided.
 */

export interface CurveChart {
  setData(planned: readonly CurvePoint[], actual: readonly CurvePoint[]): void;
  markLastReport(day: string | null, text: string): void;
  applyPalette(palette: CurvePalette): void;
  destroy(): void;
}

/**
 * Loads the substrate and draws an empty chart into `host`.
 *
 * The import is dynamic for two reasons that both matter to this product: the module touches the
 * DOM, so a server render must never evaluate it, and a consumer who never shows a chart should not
 * pay ~40 KB over a phone connection to find that out.
 */
export async function mountCurveChart(host: HTMLElement, palette: CurvePalette): Promise<CurveChart> {
  const { ColorType, LineSeries, LineStyle, createChart, createSeriesMarkers } = await import('lightweight-charts');

  const chart = createChart(host, {
    autoSize: true,
    /* A dashboard chart is read, not traded. Panning and zooming would let somebody scroll the plan
       off the screen and leave them looking at a fragment with no way back, so the whole span is
       fitted and the viewport is fixed. */
    handleScroll: false,
    handleScale: false,
  });

  const planned = chart.addSeries(LineSeries, {
    lineWidth: 2,
    lineStyle: LineStyle.Dashed,
    priceLineVisible: false,
    lastValueVisible: false,
    /* Pinned to 0–100 rather than autoscaled. Autoscale would stretch a project that has reached 30%
       to the full height of the chart, which reads as "nearly there" — the opposite of the truth. An
       S-curve is about how far up the hill the work is, so the hill stays a fixed height. */
    autoscaleInfoProvider: () => ({ priceRange: { minValue: 0, maxValue: 100 } }),
  });
  const actual = chart.addSeries(LineSeries, {
    lineWidth: 3,
    priceLineVisible: false,
    lastValueVisible: false,
    autoscaleInfoProvider: () => ({ priceRange: { minValue: 0, maxValue: 100 } }),
  });
  const markers = createSeriesMarkers(actual, []);

  const apply = (next: CurvePalette) => {
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
      localization: { priceFormatter: (value: number) => `${Math.round(value)}%` },
    });
    planned.applyOptions({ color: next.planned, crosshairMarkerBorderColor: next.background });
    actual.applyOptions({ color: next.actual, crosshairMarkerBorderColor: next.background });
  };
  apply(palette);

  let currentPalette = palette;
  return {
    setData(plannedPoints, actualPoints) {
      planned.setData(plannedPoints.map((point) => ({ time: point.day, value: point.percent })));
      actual.setData(actualPoints.map((point) => ({ time: point.day, value: point.percent })));
      chart.timeScale().fitContent();
    },
    markLastReport(day, text) {
      /* It marks the **last report**, not today, and that is a correctness matter rather than a
         preference: a marker attaches to a data point, so a "today" mark snapped to whichever reported
         day sat nearest and then carried a label that was simply false — an arrow reading "Today"
         pointing four days off it. The last reported day is a point that always exists, the arrow lands
         exactly on it, and it tells a reader the one thing the line cannot: how stale the actual is.
         Today's reading is stated in words above the plot, where it needs no pixel to land on.

         Below the point, not above: above is where the plan line runs whenever the job is behind, which
         is the case anybody reads this chart for. */
      markers.setMarkers(day === null ? [] : [{
        time: day,
        position: 'belowBar',
        shape: 'arrowUp',
        color: currentPalette.actual,
        text,
      }]);
    },
    applyPalette(next) {
      currentPalette = next;
      apply(next);
    },
    destroy() {
      chart.remove();
    },
  };
}
