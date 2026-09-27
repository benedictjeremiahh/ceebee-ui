'use client';

import { useEffect, useMemo, useRef } from 'react';
import { cn, type DecorHue, type Tone } from '../lib/cn.js';
import { createCssProbe, watchTokens } from '../lib/css-probe.js';
import { mountMiniChart, type MiniChartAppearance, type MountedMiniChart } from './mini-chart.chart.js';
import { miniChartPoints } from './mini-chart.math.js';

export interface SparklineProps {
  values: number[];
  width?: number | '100%';
  height?: number;
  tone?: Tone;
  hue?: DecorHue;
  /** Fills under the line. Use it when the shape matters more than the exact values. */
  filled?: boolean;
  /** Marks the final point — the "where it ended up" dot. */
  showLast?: boolean;
  label: string;
  className?: string;
}

/** Trend at a glance. The chart substrate owns its scale and plotted series. */
export function Sparkline({
  values, width = 120, height = 32, tone = 'brand', hue, filled = false, showLast = true, label, className,
}: SparklineProps) {
  const host = useRef<HTMLDivElement>(null);
  const points = useMemo(() => miniChartPoints(values), [values]);
  useEffect(() => {
    const element = host.current;
    if (!element || points.length === 0) return;
    const initial = readAppearance(element);
    if (!initial) return;
    let mounted: MountedMiniChart | null = null;
    let cancelled = false;
    void mountMiniChart(element, points, filled ? 'area' : 'line', width, height, showLast, initial).then((chart) => {
      if (cancelled) chart.destroy();
      else {
        mounted = chart;
        chart.applyAppearance(readAppearance(element) ?? initial);
      }
    });
    const stopWatching = watchTokens(() => {
      const appearance = readAppearance(element);
      if (appearance) mounted?.applyAppearance(appearance);
    });
    return () => {
      cancelled = true;
      stopWatching();
      mounted?.destroy();
    };
  }, [points, filled, width, height, showLast]);
  return <div className={cn('cb-sparkline', className)} data-tone={tone} data-hue={hue} role="img" aria-label={label}
    style={width === '100%' ? { inlineSize: '100%' } : undefined}>
    <div ref={host} className="cb-sparkline__canvas" style={{ inlineSize: width, blockSize: height }} aria-hidden="true" />
  </div>;
}

export interface BarMiniProps {
  values: number[];
  width?: number | '100%';
  height?: number;
  tone?: Tone;
  hue?: DecorHue;
  label: string;
  className?: string;
}

/** Compact counts, rendered as a histogram by the chart substrate. */
export function BarMini({ values, width = 120, height = 32, tone = 'brand', hue, label, className }: BarMiniProps) {
  const host = useRef<HTMLDivElement>(null);
  const points = useMemo(() => miniChartPoints(values), [values]);
  useEffect(() => {
    const element = host.current;
    if (!element || points.length === 0) return;
    const initial = readAppearance(element);
    if (!initial) return;
    let mounted: MountedMiniChart | null = null;
    let cancelled = false;
    void mountMiniChart(element, points, 'bar', width, height, false, initial).then((chart) => {
      if (cancelled) chart.destroy();
      else {
        mounted = chart;
        chart.applyAppearance(readAppearance(element) ?? initial);
      }
    });
    const stopWatching = watchTokens(() => {
      const appearance = readAppearance(element);
      if (appearance) mounted?.applyAppearance(appearance);
    });
    return () => {
      cancelled = true;
      stopWatching();
      mounted?.destroy();
    };
  }, [points, width, height]);
  return <div className={cn('cb-sparkline', className)} data-tone={tone} data-hue={hue} role="img" aria-label={label}
    style={width === '100%' ? { inlineSize: '100%' } : undefined}>
    <div ref={host} className="cb-sparkline__canvas" style={{ inlineSize: width, blockSize: height }} aria-hidden="true" />
  </div>;
}

function readAppearance(element: HTMLElement): MiniChartAppearance | null {
  const probe = createCssProbe(element.parentElement ?? element);
  const accent = probe.color('--cb-spark-accent');
  probe.done();
  const background = getComputedStyle(element).backgroundColor;
  return accent && background ? { accent, background } : null;
}
