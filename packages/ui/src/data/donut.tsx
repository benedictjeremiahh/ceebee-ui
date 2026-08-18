import { cn, type DecorHue } from '../lib/cn.js';
import { donutArcs, type DonutSlice } from './donut.math.js';

export interface DonutProps {
  slices: DonutSlice[];
  size?: number;
  thickness?: number;
  /** Colour per slice, in order. Falls back to the decorative palette. */
  hues?: DecorHue[];
  /** Content in the hole — a total, usually. */
  children?: React.ReactNode;
  label: string;
  className?: string;
}

const DEFAULT_HUES: DecorHue[] = ['violet', 'blue', 'teal', 'green', 'amber', 'rose'];

/** A proportion widget, not a chart: no axis, no scale, no tooltip (ADR 0007). */
export function Donut({ slices, size = 120, thickness = 16, hues = DEFAULT_HUES, children, label, className }: DonutProps) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcs = donutArcs(slices, circumference);
  const center = size / 2;

  return (
    <div className={cn('cb-donut', className)} style={{ width: size, height: size }} role="img" aria-label={label}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle className="cb-donut__track" cx={center} cy={center} r={radius} strokeWidth={thickness} fill="none" />
        {arcs.map((arc) => (
          <circle
            key={`${arc.label}-${arc.index}`}
            className="cb-donut__arc"
            data-hue={hues[arc.index % hues.length]}
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={thickness}
            fill="none"
            strokeDasharray={`${arc.length} ${circumference - arc.length}`}
            strokeDashoffset={arc.offset}
            transform={`rotate(-90 ${center} ${center})`}
          />
        ))}
      </svg>
      {children ? <div className="cb-donut__center">{children}</div> : null}
    </div>
  );
}
