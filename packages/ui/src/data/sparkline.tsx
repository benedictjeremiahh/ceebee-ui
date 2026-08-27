import { cn, type DecorHue, type Tone } from '../lib/cn.js';
import { sparklineGeometry } from './sparkline.math.js';

export interface SparklineProps {
  values: number[];
  width?: number;
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

/** Trend at a glance. No axis, no scale, so it is a Widget rather than a Chart. */
export function Sparkline({
  values,
  width = 120,
  height = 32,
  tone = 'brand',
  hue,
  filled = false,
  showLast = true,
  label,
  className,
}: SparklineProps) {
  const { line, area, points } = sparklineGeometry(values, width, height);
  const last = points[points.length - 1];

  return (
    <div className={cn('cb-sparkline', className)} data-tone={tone} data-hue={hue} role="img" aria-label={label}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
        {filled && area ? <path className="cb-sparkline__area" d={area} /> : null}
        {line ? <path className="cb-sparkline__line" d={line} fill="none" /> : null}
        {showLast && last ? <circle className="cb-sparkline__last" cx={last.x} cy={last.y} r={2.5} /> : null}
      </svg>
    </div>
  );
}

export interface BarMiniProps {
  values: number[];
  width?: number;
  height?: number;
  tone?: Tone;
  hue?: DecorHue;
  label: string;
  className?: string;
}

/** The same idea in bars, for counts rather than a continuous series. */
export function BarMini({ values, width = 120, height = 32, tone = 'brand', hue, label, className }: BarMiniProps) {
  const usable = values.filter((value) => Number.isFinite(value));
  const max = Math.max(...usable, 0);
  const gap = 2;
  const barWidth = usable.length > 0 ? Math.max((width - gap * (usable.length - 1)) / usable.length, 1) : 0;

  return (
    <div className={cn('cb-sparkline', className)} data-tone={tone} data-hue={hue} role="img" aria-label={label}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
        {usable.map((value, index) => {
          // A zero-height bar is invisible, so every bar keeps a 1px foot.
          const barHeight = max > 0 ? Math.max((value / max) * height, 1) : 1;
          return (
            <rect
              key={index}
              className="cb-sparkline__bar"
              x={index * (barWidth + gap)}
              y={height - barHeight}
              width={barWidth}
              height={barHeight}
              rx={1}
            />
          );
        })}
      </svg>
    </div>
  );
}
