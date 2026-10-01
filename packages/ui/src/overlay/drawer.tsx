'use client';

import { Drawer as AntDrawer } from 'antd';
import type { DrawerProps as AntDrawerProps } from 'antd';

import { cn } from '../lib/cn.js';
import './drawer.css';

export type DrawerProps = AntDrawerProps;

/**
 * Ant Design's Drawer on CeeBee's documented drawer rung.
 *
 * Drawer is deliberately a thin adapter rather than a restyled generic: Ant owns its interaction,
 * accessibility, motion, and geometry. This layer only guarantees that the Drawer and its backdrop
 * resolve to `--cb-z-drawer` and `--cb-z-drawer-backdrop`, so a Drawer and a page-level Modal keep
 * the ladder the design system documents.
 *
 * Everything else is Ant's contract, untouched.
 */
function DrawerRoot({ classNames, rootClassName, ...props }: DrawerProps) {
  const drawerClassNames =
    typeof classNames === 'function'
      ? (info: Parameters<typeof classNames>[0]) => {
          const resolved = classNames(info) ?? {};
          return {
            ...resolved,
            mask: cn('cb-drawer__backdrop', resolved.mask),
          };
        }
      : {
          ...classNames,
          mask: cn('cb-drawer__backdrop', classNames?.mask),
        };

  return (
    <AntDrawer
      {...props}
      rootClassName={cn('cb-drawer', rootClassName)}
      classNames={drawerClassNames}
    />
  );
}

export const Drawer: typeof DrawerRoot & Omit<typeof AntDrawer, never> = Object.assign(DrawerRoot, AntDrawer);
