'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import { AlertTriangle } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
import type { Tone } from '../../lib/cn.js';
import { ArrowShape, type Align, type Side } from '../popover.js';
import { PopconfirmSkeleton } from './popconfirm.skeleton.js';

export interface PopconfirmProps {
  /** Native interactive element that anchors and opens the confirmation. */
  trigger: ReactElement;
  title: ReactNode;
  description?: ReactNode;
  /** Dismisses the confirmation after the rendered action handles its click. */
  cancelAction?: ReactElement;
  /** Dismisses the confirmation after the rendered action handles its click. */
  confirmAction: ReactElement;
  tone?: Extract<Tone, 'neutral' | 'warning' | 'danger'>;
  icon?: ReactNode;
  side?: Side;
  align?: Align;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  motion?: boolean;
}

/**
 * Anchored, lightweight confirmation. Base UI owns anchoring, outside dismissal, Escape,
 * initial focus, and focus restoration when dismissal does not move focus elsewhere.
 * Viewport-modal confirmation remains Modal.Confirm.
 */
function PopconfirmRoot({
  trigger,
  title,
  description,
  cancelAction,
  confirmAction,
  tone = 'warning',
  icon,
  side = 'top',
  align = 'center',
  open,
  defaultOpen,
  onOpenChange,
  motion = true,
}: PopconfirmProps) {
  const hasIcon = icon !== null;

  return (
    <BasePopover.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <BasePopover.Trigger render={trigger} />
      <BasePopover.Portal>
        <BasePopover.Positioner
          side={side}
          align={align}
          className="cb-popconfirm__positioner"
        >
          <BasePopover.Popup
            className="cb-popconfirm"
            data-tone={tone}
            data-motion={motion ? undefined : 'off'}
            data-icon={hasIcon ? undefined : 'none'}
          >
            <BasePopover.Arrow className="cb-popconfirm__arrow">
              <ArrowShape />
            </BasePopover.Arrow>
            {hasIcon ? (
              <span className="cb-popconfirm__icon" aria-hidden="true">
                {icon ?? <AlertTriangle size={18} />}
              </span>
            ) : null}
            <div className="cb-popconfirm__content">
              <BasePopover.Title className="cb-popconfirm__title">{title}</BasePopover.Title>
              {description ? (
                <BasePopover.Description className="cb-popconfirm__description">
                  {description}
                </BasePopover.Description>
              ) : null}
              <div className="cb-popconfirm__actions">
                {cancelAction ? <BasePopover.Close render={cancelAction} /> : null}
                <BasePopover.Close render={confirmAction} />
              </div>
            </div>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}

export const Popconfirm = Object.assign(PopconfirmRoot, {
  Skeleton: PopconfirmSkeleton,
});
