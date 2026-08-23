'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Check } from 'lucide-react';
import { Fragment, type ReactElement, type ReactNode } from 'react';
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

export interface MenuSection {
  label?: ReactNode;
  items: MenuItem[];
}

interface DropdownMenuBaseProps {
  trigger: ReactElement;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export type DropdownMenuProps = DropdownMenuBaseProps & (
  | { items: MenuItem[]; sections?: never }
  | { items?: never; sections: MenuSection[] }
);

/** Typeahead, roving focus, and dismissal are Base UI's; the surface and the rhythm are ours. */
export function Dropdown({ trigger, items, sections, align = 'end', side = 'bottom', className }: DropdownMenuProps) {
  const groups: MenuSection[] = sections ?? [{ items }];

  return (
    <BaseMenu.Root>
      <BaseMenu.Trigger render={trigger} />
      <BaseMenu.Portal>
        <BaseMenu.Positioner
          side={side}
          align={align}
          sideOffset={6}
          className="cb-menu-positioner"
        >
          <BaseMenu.Popup className={cn('cb-menu', className)}>
            {groups.map((section, sectionIndex) => (
              <Fragment key={`section-${sectionIndex}`}>
                {sectionIndex > 0 ? <BaseMenu.Separator className="cb-menu__separator" /> : null}
                <BaseMenu.Group className="cb-menu__group">
                  {section.label ? (
                    <BaseMenu.GroupLabel className="cb-menu__group-label">
                      {section.label}
                    </BaseMenu.GroupLabel>
                  ) : null}
                  {section.items.map((item, itemIndex) =>
                    item.separator ? (
                      <BaseMenu.Separator className="cb-menu__separator" key={`separator-${itemIndex}`} />
                    ) : (
                      <BaseMenu.Item
                        key={`${String(item.label)}-${itemIndex}`}
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
                </BaseMenu.Group>
              </Fragment>
            ))}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}
