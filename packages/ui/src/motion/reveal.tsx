'use client';

import { motion } from 'motion/react';
import { Children, type ReactNode } from 'react';
import { useMotionSettings, type SpringPreset } from './motion-provider.js';

export interface RevealProps {
  children: ReactNode;
  /** Direction the content travels from. Under reduced motion it only fades. */
  from?: 'below' | 'above' | 'left' | 'right' | 'none';
  distance?: number;
  delay?: number;
  spring?: SpringPreset;
  /** Waits until the element scrolls into view instead of animating on mount. */
  onView?: boolean;
  className?: string;
}

const OFFSETS = {
  below: (d: number) => ({ y: d }),
  above: (d: number) => ({ y: -d }),
  left: (d: number) => ({ x: -d }),
  right: (d: number) => ({ x: d }),
  none: () => ({}),
} as const;

export function Reveal({
  children,
  from = 'below',
  distance = 12,
  delay = 0,
  spring = 'soft',
  onView = false,
  className,
}: RevealProps) {
  const { enabled, spring: transition } = useMotionSettings();
  const offset = enabled ? OFFSETS[from](distance) : {};
  const hidden = { opacity: 0, ...offset };
  const shown = { opacity: 1, x: 0, y: 0 };

  return (
    <motion.div
      className={className}
      initial={hidden}
      {...(onView
        ? { whileInView: shown, viewport: { once: true, margin: '-10% 0px' } }
        : { animate: shown })}
      transition={{ ...transition(spring), delay: enabled ? delay : 0 }}
    >
      {children}
    </motion.div>
  );
}

export interface StaggerProps {
  children: ReactNode;
  /** Seconds between children. Collapses to zero under reduced motion. */
  step?: number;
  from?: RevealProps['from'];
  onView?: boolean;
  className?: string;
}

/** Wraps each child in a Reveal with an increasing delay — the list arrives, it does not pop. */
export function Stagger({ children, step = 0.06, from = 'below', onView = false, className }: StaggerProps) {
  return (
    <div className={className}>
      {Children.map(children, (child, index) => (
        <Reveal from={from} delay={index * step} onView={onView}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
