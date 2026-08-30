'use client';

import { X } from 'lucide-react';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';
import { cn, type DecorHue } from '../../lib/cn.js';
import { useMotionSettings } from '../../motion/motion-provider.js';
import { StickerGroupSkeleton, type StickerGroupSkeletonProps } from './sticker-group.skeleton.js';

export interface StickerItem {
  id: string;
  label: ReactNode;
  /** Decorative only; use app copy to communicate meaning. */
  hue?: DecorHue;
  /** Accessible item name when `label` is not plain text. */
  ariaLabel?: string;
}

export interface StickerGroupProps {
  items: StickerItem[];
  onDismiss: (id: string) => void;
  /** Names the collection when the surrounding heading does not. */
  label?: string;
  /** Localises the button name. */
  getDismissLabel?: (item: StickerItem) => string;
  motion?: boolean;
  className?: string;
}

const STICKER_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    y: 'var(--cb-sticker-enter-y)',
    rotate: 'var(--cb-tilt-none)',
    scale: 'var(--cb-sticker-enter-scale)',
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 'var(--cb-sticker-tilt)',
    scale: 1,
  },
  exit: {
    opacity: 0,
    x: 'var(--cb-sticker-resolved-exit-x)',
    y: 'var(--cb-sticker-enter-y)',
    rotate: 'var(--cb-sticker-resolved-exit-rotate)',
    scale: 'var(--cb-sticker-exit-scale)',
  },
  still: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 },
  stillExit: { opacity: 0, x: 0, y: 0, rotate: 0, scale: 1 },
};

/**
 * A sticker's angle belongs to the sticker, not to where it happens to be standing.
 *
 * Deriving it from the array index meant removing one re-tilted every sticker after it: the
 * collection appeared to rearrange itself in response to a dismissal it had nothing to do with.
 * A hash of the item's own id is stable for as long as that value is on screen, and still spreads
 * a fresh set of values across the three angles.
 */
function stableChoice(id: string, salt: string, options: number) {
  let hash = 2166136261;
  for (const character of `${salt}:${id}`) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % options;
}

const TILTS = ['left', 'right', 'none'] as const;
const EXITS = ['left', 'right'] as const;

/**
 * A controlled list of removable values. Each sticker is one native button: Tab reaches it and
 * Enter or Space dismisses it. The collection owns only exit choreography, never product state.
 */
function StickerGroupRoot({
  items,
  onDismiss,
  label,
  getDismissLabel,
  motion: motionEnabled = true,
  className,
}: StickerGroupProps) {
  const motionSettings = useMotionSettings();
  const shouldMove = motionEnabled && motionSettings.enabled;

  return (
    <ul className={cn('cb-sticker-group', className)} aria-label={label}>
      <AnimatePresence initial={false}>
        {items.map((item) => {
          const tilt = TILTS[stableChoice(item.id, 'tilt', TILTS.length)];
          const exit = EXITS[stableChoice(item.id, 'exit', EXITS.length)];
          const itemLabel = item.ariaLabel ?? (typeof item.label === 'string' ? item.label : 'item');
          const dismissLabel = getDismissLabel?.(item) ?? `Remove ${itemLabel}`;

          return (
            <motion.li
              className="cb-sticker-group__item"
              data-exit={exit}
              data-hue={item.hue}
              data-tilt={tilt}
              initial={shouldMove ? 'hidden' : false}
              animate={shouldMove ? 'visible' : 'still'}
              exit={shouldMove ? 'exit' : 'stillExit'}
              key={item.id}
              layout={shouldMove ? 'position' : false}
              transition={shouldMove ? motionSettings.spring('bouncy') : { duration: 0 }}
              variants={STICKER_VARIANTS}
            >
              <button
                type="button"
                className="cb-sticker-group__button"
                aria-label={dismissLabel}
                onClick={() => onDismiss(item.id)}
              >
                <span className="cb-sticker-group__label">{item.label}</span>
                <X className="cb-sticker-group__icon" aria-hidden="true" />
              </button>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}

export const StickerGroup = Object.assign(StickerGroupRoot, { Skeleton: StickerGroupSkeleton });
export type { StickerGroupSkeletonProps };
