"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn.js";
import {
  ImagePreviewGroupSkeleton,
  ImageSkeleton,
} from "./image.skeleton.js";

type TokenReference = `var(--${string})`;

export interface ImageProps {
  src: string;
  /** Empty string is allowed, and means "decorative" — but it has to be said out loud. */
  alt: string;
  /** Width / height, e.g. 16 / 9. Reserves the space so nothing below it jumps. */
  aspectRatio?: number;
  /** A tiny data URI, blurred up while the real image loads. */
  blurDataUrl?: string;
  /** Flat colour to sit behind the image when there is no blur placeholder. */
  background?: TokenReference;
  fit?: "cover" | "contain";
  radius?: "none" | "sm" | "md" | "lg" | "xl";
  loading?: "lazy" | "eager";
  /** Opts this image out of its loading fade without changing its visibility. */
  motion?: boolean;
  className?: string;
}

function ImageRoot({
  src,
  alt,
  aspectRatio,
  blurDataUrl,
  background,
  fit = "cover",
  radius = "md",
  loading = "lazy",
  motion = true,
  className,
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  const style = {
    ...(aspectRatio ? { aspectRatio: String(aspectRatio) } : {}),
    ...(background ? { background } : {}),
    ...(blurDataUrl ? { backgroundImage: `url(${blurDataUrl})` } : {}),
  } as CSSProperties;

  return (
    <span
      className={cn("cb-image", `cb-radius--${radius}`, className)}
      data-loaded={loaded || undefined}
      data-blurred={blurDataUrl ? "" : undefined}
      data-motion={motion ? undefined : "off"}
      style={style}
    >
      <img
        className="cb-image__img"
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        style={{ objectFit: fit }}
        onLoad={() => setLoaded(true)}
        ref={(node) => {
          // A cached image can finish before React attaches onLoad; this catches that case.
          if (node?.complete) setLoaded(true);
        }}
      />
    </span>
  );
}

export interface ImagePreviewItem extends ImageProps {
  /** Stable identity for React and controlled collections. */
  id: string;
  /** Optional larger source used only inside the preview. */
  previewSrc?: string;
  /** Optional content shown below the fullscreen image. */
  caption?: ReactNode;
}

export interface ImagePreviewLabels {
  close: string;
  previous: string;
  next: string;
  zoomIn: string;
  zoomOut: string;
  resetZoom: string;
  open: (item: ImagePreviewItem, index: number) => string;
  position: (current: number, total: number) => string;
}

const DEFAULT_PREVIEW_LABELS: ImagePreviewLabels = {
  close: "Close preview",
  previous: "Previous image",
  next: "Next image",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  resetZoom: "Reset zoom",
  open: (item) => `Preview ${item.alt || "image"}`,
  position: (current, total) => `Image ${current} of ${total}`,
};

export interface ImagePreviewGroupProps {
  items: readonly ImagePreviewItem[];
  /** Accessible name for the thumbnail collection. */
  label: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  loop?: boolean;
  labels?: Partial<ImagePreviewLabels>;
  motion?: boolean;
  className?: string;
}

function clampIndex(index: number, length: number) {
  return Math.max(0, Math.min(index, Math.max(length - 1, 0)));
}

function ImagePreviewGroupRoot({
  items,
  label,
  open,
  defaultOpen = false,
  onOpenChange,
  index,
  defaultIndex = 0,
  onIndexChange,
  loop = false,
  labels: labelOverrides,
  motion = true,
  className,
}: ImagePreviewGroupProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [internalIndex, setInternalIndex] = useState(() =>
    clampIndex(defaultIndex, items.length)
  );
  const [scale, setScale] = useState(1);
  const isOpen = open ?? internalOpen;
  const selectedIndex = clampIndex(index ?? internalIndex, items.length);
  const selectedItem = items[selectedIndex];
  const labels = useMemo(
    () => ({ ...DEFAULT_PREVIEW_LABELS, ...labelOverrides }),
    [labelOverrides]
  );

  const changeOpen = (nextOpen: boolean) => {
    if (open === undefined) setInternalOpen(nextOpen);
    if (!nextOpen) setScale(1);
    onOpenChange?.(nextOpen);
  };

  const changeIndex = (nextIndex: number) => {
    if (items.length === 0) return;
    const next = loop
      ? (nextIndex + items.length) % items.length
      : clampIndex(nextIndex, items.length);
    if (index === undefined) setInternalIndex(next);
    setScale(1);
    onIndexChange?.(next);
  };

  useEffect(() => {
    if (selectedIndex !== (index ?? internalIndex) && index === undefined) {
      setInternalIndex(selectedIndex);
    }
  }, [index, internalIndex, selectedIndex]);

  const canGoPrevious = (loop && items.length > 1) || selectedIndex > 0;
  const canGoNext =
    (loop && items.length > 1) || selectedIndex < items.length - 1;
  const zoomIn = () => setScale((current) => Math.min(3, current + 0.5));
  const zoomOut = () => setScale((current) => Math.max(1, current - 0.5));

  const onPreviewKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" && canGoPrevious)
      changeIndex(selectedIndex - 1);
    else if (event.key === "ArrowRight" && canGoNext)
      changeIndex(selectedIndex + 1);
    else if (event.key === "+" || event.key === "=") zoomIn();
    else if (event.key === "-") zoomOut();
    else if (event.key === "0") setScale(1);
    else if (event.key === "Home") changeIndex(0);
    else if (event.key === "End") changeIndex(items.length - 1);
    else return;
    event.preventDefault();
  };

  return (
    <BaseDialog.Root open={isOpen} onOpenChange={changeOpen}>
      <div
        className={cn("cb-image-preview-group", className)}
        role="group"
        aria-label={label}
      >
        {items.map((item, itemIndex) => {
          const {
            id,
            previewSrc: _previewSrc,
            caption: _caption,
            ...imageProps
          } = item;
          return (
            <BaseDialog.Trigger
              key={id}
              className="cb-image-preview-group__trigger"
              aria-label={labels.open(item, itemIndex)}
              onClick={() => changeIndex(itemIndex)}
            >
              <ImageRoot {...imageProps} />
            </BaseDialog.Trigger>
          );
        })}
      </div>

      <BaseDialog.Portal>
        {selectedItem ? (
          <>
            <BaseDialog.Backdrop className="cb-image-preview__backdrop" />
            <BaseDialog.Popup
              className="cb-image-preview"
              data-motion={motion ? undefined : "off"}
              onKeyDown={onPreviewKeyDown}
            >
              <BaseDialog.Title className="cb-image-preview__sr-title">
                {labels.position(selectedIndex + 1, items.length)}
              </BaseDialog.Title>

              <div className="cb-image-preview__toolbar">
                <span className="cb-image-preview__position" aria-live="polite">
                  {labels.position(selectedIndex + 1, items.length)}
                </span>
                <button
                  type="button"
                  className="cb-image-preview__control"
                  aria-label={labels.zoomOut}
                  disabled={scale === 1}
                  onClick={zoomOut}
                >
                  <ZoomOut aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="cb-image-preview__control"
                  aria-label={labels.resetZoom}
                  disabled={scale === 1}
                  onClick={() => setScale(1)}
                >
                  <RotateCcw aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="cb-image-preview__control"
                  aria-label={labels.zoomIn}
                  disabled={scale === 3}
                  onClick={zoomIn}
                >
                  <ZoomIn aria-hidden="true" />
                </button>
                <BaseDialog.Close
                  className="cb-image-preview__control"
                  aria-label={labels.close}
                >
                  <X aria-hidden="true" />
                </BaseDialog.Close>
              </div>

              <div className="cb-image-preview__stage">
                <button
                  type="button"
                  className="cb-image-preview__navigation cb-image-preview__navigation--previous"
                  aria-label={labels.previous}
                  disabled={!canGoPrevious}
                  onClick={() => changeIndex(selectedIndex - 1)}
                >
                  <ChevronLeft aria-hidden="true" />
                </button>
                <img
                  key={selectedItem.id}
                  className="cb-image-preview__image"
                  src={selectedItem.previewSrc ?? selectedItem.src}
                  alt={selectedItem.alt}
                  style={{ "--cb-image-preview-scale": scale } as CSSProperties}
                  onDoubleClick={() =>
                    setScale((current) => (current === 1 ? 2 : 1))
                  }
                />
                <button
                  type="button"
                  className="cb-image-preview__navigation cb-image-preview__navigation--next"
                  aria-label={labels.next}
                  disabled={!canGoNext}
                  onClick={() => changeIndex(selectedIndex + 1)}
                >
                  <ChevronRight aria-hidden="true" />
                </button>
              </div>

              {selectedItem.caption ? (
                <div className="cb-image-preview__caption">
                  {selectedItem.caption}
                </div>
              ) : null}
            </BaseDialog.Popup>
          </>
        ) : null}
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

/**
 * `Image` stays an image-loading composition. Preview is a separate compound contract because it
 * adds dialog semantics, keyboard navigation, focus ownership, and a zoom gesture (ADR 0014).
 */
export const Image = Object.assign(ImageRoot, {
  PreviewGroup: Object.assign(ImagePreviewGroupRoot, {
    Skeleton: ImagePreviewGroupSkeleton,
  }),
  Skeleton: ImageSkeleton,
});
