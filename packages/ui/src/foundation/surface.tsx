import type { ReactNode } from 'react';
import { cn, type DecorHue, type Tone } from '../lib/cn.js';

export type SurfaceVariant = 'plain' | 'tinted' | 'glass' | 'gradient';

export interface SurfaceProps {
  variant?: SurfaceVariant;
  /** Semantic colour for `tinted`; ignored by `plain`. */
  tone?: Tone;
  /** Decorative hue for `tinted` / `gradient` — the pastel card set. Wins over `tone`. */
  hue?: DecorHue;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  bordered?: boolean;
  className?: string;
  children?: ReactNode;
  /** Renders a different element; the library ships no polymorphic `as` beyond this. */
  asSection?: boolean;
}

/**
 * The panel every raised or tinted thing is built on. Glass and gradient live here as
 * variants rather than being baked into the brand (ADR 0002), so one Skin reproduces the
 * reference board and another produces something sober without touching a component.
 */
export function Surface({
  variant = 'plain',
  tone = 'neutral',
  hue,
  elevation = 'sm',
  radius = 'lg',
  padding = 'md',
  bordered = true,
  className,
  children,
  asSection = false,
}: SurfaceProps) {
  const Tag = asSection ? 'section' : 'div';
  return (
    <Tag
      className={cn(
        'cb-surface',
        `cb-surface--${variant}`,
        `cb-elevation--${elevation}`,
        `cb-radius--${radius}`,
        `cb-pad--${padding}`,
        bordered && 'cb-surface--bordered',
        className,
      )}
      data-tone={variant === 'plain' ? undefined : tone}
      data-hue={hue}
    >
      {children}
    </Tag>
  );
}
