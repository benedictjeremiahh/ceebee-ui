'use client';

import { Dropdown as AntDropdown } from 'antd';
import type { DropdownProps } from 'antd';
import { forwardRef, useCallback, useRef } from 'react';

export type { DropdownProps } from 'antd';

function triggerElement(value: unknown): HTMLElement | null {
  if (value instanceof HTMLElement) return value;
  if (value && typeof value === 'object' && 'nativeElement' in value
    && value.nativeElement instanceof HTMLElement) return value.nativeElement;
  return null;
}

const DropdownRoot = forwardRef<HTMLElement, DropdownProps>(function DropdownRoot(
  { menu, onOpenChange, ...props },
  ref,
) {
  const trigger = useRef<HTMLElement | null>(null);
  const setTrigger = useCallback((node: HTMLElement | null) => {
    // Upstream passes a composite child's imperative ref (for example Tooltip), despite its
    // HTMLElement declaration. Keep callers' refs intact and resolve only our focus anchor.
    trigger.current = triggerElement(node);
    if (typeof ref === 'function') return ref(node);
    if (ref) ref.current = node;
  }, [ref]);

  return (
    <AntDropdown
      {...props}
      ref={setTrigger}
      menu={menu ? {
        ...menu,
        onClick: (info) => {
          // Menu activates on keydown. Consume Enter before focus moves so the browser cannot
          // turn that same keystroke into a click on the new dialog's initially focused button.
          if (!(menu.selectable && menu.multiple) && 'key' in info.domEvent
            && info.domEvent.key === 'Enter') info.domEvent.preventDefault();
          menu.onClick?.(info);
        },
      } : undefined}
      onOpenChange={(open, info) => {
        // The menu item may open a dialog in this same event. Return to a durable anchor before
        // React commits that dialog, so its restoration target survives the menu's dismissal.
        if (!open && info.source === 'menu' && trigger.current?.isConnected) {
          trigger.current.focus({ preventScroll: true });
        }
        onOpenChange?.(open, info);
      }}
    />
  );
});

DropdownRoot.displayName = 'Dropdown';

export const Dropdown = Object.assign(DropdownRoot, {
  Button: AntDropdown.Button,
  _InternalPanelDoNotUseOrYouWillBeFired: AntDropdown._InternalPanelDoNotUseOrYouWillBeFired,
});
