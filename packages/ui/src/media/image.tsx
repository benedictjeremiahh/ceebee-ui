'use client';

import { Image as AntImage } from 'antd';
import type { ImageProps as AntImageProps } from 'antd';
import type { ComponentProps } from 'react';
import { useId, useLayoutEffect, useState } from 'react';
import { cn } from '../lib/cn.js';
import { DEFAULT_LABELS, useLabels, type Labels } from '../lib/labels.js';

export type ImageProps = AntImageProps;
export type ImagePreviewGroupProps = ComponentProps<typeof AntImage.PreviewGroup>;

const PREVIEW_CONTROL_LABELS = [
  { classSuffix: '-image-preview-close', label: 'close' },
  { classSuffix: '-image-preview-switch-prev', label: 'imagePrevious' },
  { classSuffix: '-image-preview-switch-next', label: 'imageNext' },
  { classSuffix: '-image-preview-actions-action-flipX', label: 'imageFlipHorizontal' },
  { classSuffix: '-image-preview-actions-action-flipY', label: 'imageFlipVertical' },
  { classSuffix: '-image-preview-actions-action-rotateLeft', label: 'imageRotateLeft' },
  { classSuffix: '-image-preview-actions-action-rotateRight', label: 'imageRotateRight' },
  { classSuffix: '-image-preview-actions-action-zoomOut', label: 'imageZoomOut' },
  { classSuffix: '-image-preview-actions-action-zoomIn', label: 'imageZoomIn' },
] as const satisfies ReadonlyArray<{ classSuffix: string; label: keyof Labels }>;

function startsOpen(preview: boolean | { open?: boolean; visible?: boolean } | undefined): boolean {
  return typeof preview === 'object' && preview !== null && (preview.open ?? preview.visible) === true;
}

/**
 * Ant owns the preview controls and their behavior. Its pinned image runtime writes English
 * operation names directly onto those rendered buttons, so this adapter changes only their names.
 * Each instance adds a unique class to its own popup root; the observer never watches the document
 * or another Image preview, and it disconnects after the preview closes or the owner unmounts.
 */
function usePreviewControlLabels(rootClassName: string, open: boolean, labels: Labels, portalRevision: number) {
  useLayoutEffect(() => {
    if (!open || typeof document === 'undefined') return;

    const root = [...document.getElementsByClassName(rootClassName)]
      .find((element): element is HTMLElement => element instanceof HTMLElement);
    if (!root) return;

    const labelControls = () => {
      root.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
        const control = PREVIEW_CONTROL_LABELS.find(({ classSuffix }) =>
          [...button.classList].some((className) => className.endsWith(classSuffix)),
        );
        if (!control) return;
        const label = labels[control.label] ?? DEFAULT_LABELS[control.label];
        if (button.getAttribute('aria-label') !== label) button.setAttribute('aria-label', label);
      });
    };

    labelControls();
    const observer = new MutationObserver(labelControls);
    observer.observe(root, { attributes: true, attributeFilter: ['aria-label'], childList: true, subtree: true });
    return () => observer.disconnect();
  }, [labels, open, portalRevision, rootClassName]);
}

function schedulePortalCheck(refresh: () => void) {
  queueMicrotask(refresh);
}

function withImageClassNames(
  classNames: ImageProps['classNames'],
  ownerClassName: string,
): NonNullable<ImageProps['classNames']> {
  if (typeof classNames === 'function') {
    return (info) => {
      const resolved = classNames(info) ?? {};
      return {
        ...resolved,
        popup: {
          ...resolved.popup,
          root: cn(ownerClassName, resolved.popup?.root),
        },
      };
    };
  }

  return {
    ...classNames,
    popup: {
      ...classNames?.popup,
      root: cn(ownerClassName, classNames?.popup?.root),
    },
  };
}

function withGroupClassNames(
  classNames: ImagePreviewGroupProps['classNames'],
  ownerClassName: string,
): NonNullable<ImagePreviewGroupProps['classNames']> {
  if (typeof classNames === 'function') {
    return (info) => {
      const resolved = classNames(info) ?? {};
      return {
        ...resolved,
        popup: {
          ...resolved.popup,
          root: cn(ownerClassName, resolved.popup?.root),
        },
      };
    };
  }

  return {
    ...classNames,
    popup: {
      ...classNames?.popup,
      root: cn(ownerClassName, classNames?.popup?.root),
    },
  };
}

function ImageRoot({ classNames, preview, ...props }: ImageProps) {
  const labels = useLabels();
  const [open, setOpen] = useState(() => startsOpen(preview));
  const [portalRevision, setPortalRevision] = useState(0);
  const ownerClassName = `cb-image-preview-${useId()}`;
  const previewConfig = preview && typeof preview === 'object' ? preview : {};
  const localizedPreview = preview === false
    ? false
    : {
        ...previewConfig,
        onOpenChange: (nextOpen: boolean) => {
          if (nextOpen) {
            setOpen(true);
            schedulePortalCheck(() => setPortalRevision((revision) => revision + 1));
          }
          previewConfig.onOpenChange?.(nextOpen);
        },
        afterOpenChange: (nextOpen: boolean) => {
          if (nextOpen) {
            setOpen(true);
            setPortalRevision((revision) => revision + 1);
          } else setOpen(false);
          previewConfig.afterOpenChange?.(nextOpen);
        },
      };

  usePreviewControlLabels(ownerClassName, open, labels, portalRevision);

  return (
    <AntImage
      {...props}
      classNames={withImageClassNames(classNames, ownerClassName)}
      preview={localizedPreview}
    />
  );
}

function PreviewGroupRoot({ classNames, preview, ...props }: ImagePreviewGroupProps) {
  const labels = useLabels();
  const [open, setOpen] = useState(() => startsOpen(preview));
  const [portalRevision, setPortalRevision] = useState(0);
  const ownerClassName = `cb-image-preview-${useId()}`;
  const previewConfig = preview && typeof preview === 'object' ? preview : {};
  const localizedPreview = preview === false
    ? false
    : {
        ...previewConfig,
        onOpenChange: (nextOpen: boolean, info: Parameters<NonNullable<typeof previewConfig.onOpenChange>>[1]) => {
          if (nextOpen) {
            setOpen(true);
            schedulePortalCheck(() => setPortalRevision((revision) => revision + 1));
          }
          previewConfig.onOpenChange?.(nextOpen, info);
        },
        afterOpenChange: (nextOpen: boolean) => {
          if (nextOpen) {
            setOpen(true);
            setPortalRevision((revision) => revision + 1);
          } else setOpen(false);
          previewConfig.afterOpenChange?.(nextOpen);
        },
      };

  usePreviewControlLabels(ownerClassName, open, labels, portalRevision);

  return (
    <AntImage.PreviewGroup
      {...props}
      classNames={withGroupClassNames(classNames, ownerClassName)}
      preview={localizedPreview}
    />
  );
}

const Image = Object.assign(ImageRoot, AntImage, { PreviewGroup: PreviewGroupRoot });

export { Image };
