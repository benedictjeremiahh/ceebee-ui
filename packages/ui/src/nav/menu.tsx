'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Check } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
import { cn, type Tone } from '../lib/cn.js';

export interface MenuItem {
  /** Omit everything but `separator` to draw a divider. */
  separator?: boolean;
  label?: ReactNode;
  icon?: ReactNode;
  shortcut?: string;
  tone?: Extract<Tone, 'neutral' | 'danger'>;
  disabled?: boolean;
  checked?: boolean;
  onSelect?: () => void;
}

export interface DropdownMenuProps {
  trigger: ReactElement;
  items: MenuItem[];
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

/** Typeahead, roving focus, and dismissal are Base UI's; the surface and the rhythm are ours. */
export function DropdownMenu({ trigger, items, align = 'end', side = 'bottom', className }: DropdownMenuProps) {
  return (
    <BaseMenu.Root>
      <BaseMenu.Trigger render={trigger} />
      <BaseMenu.Portal>
        <BaseMenu.Positioner side={side} align={align} sideOffset={6}>
          <BaseMenu.Popup className={cn('cb-menu', className)}>
            {items.map((item, index) =>
              item.separator ? (
                <BaseMenu.Separator className="cb-menu__separator" key={`separator-${index}`} />
              ) : (
                <BaseMenu.Item
                  key={`${String(item.label)}-${index}`}
                  className="cb-menu__item"
                  data-tone={item.tone}
                  disabled={item.disabled}
                  onClick={item.onSelect}
                >
                  <span className="cb-menu__icon">
                    {item.checked ? <Check size={14} /> : item.icon}
                  </span>
                  <span className="cb-menu__label">{item.label}</span>
                  {item.shortcut ? <kbd className="cb-menu__shortcut">{item.shortcut}</kbd> : null}
                </BaseMenu.Item>
              ),
            )}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}
