import type { CSSProperties } from "react";
import { Skeleton } from "../feedback/skeleton.js";
import { cn } from "../lib/cn.js";

export interface ImageSkeletonProps {
  aspectRatio?: number;
  radius?: "none" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export interface ImagePreviewGroupSkeletonProps extends ImageSkeletonProps {
  items?: number;
}

/** Reserves the same aspect-ratio and radius geometry as Image (ADR 0009). */
export function ImageSkeleton({
  aspectRatio,
  radius = "md",
  className,
}: ImageSkeletonProps) {
  return (
    <span
      className={cn(
        "cb-image cb-image--skeleton",
        `cb-radius--${radius}`,
        className
      )}
      style={
        aspectRatio
          ? ({ aspectRatio: String(aspectRatio) } as CSSProperties)
          : undefined
      }
      aria-hidden="true"
    >
      <Skeleton
        className="cb-image__skeleton-shape"
        width="100%"
        height="100%"
        radius="md"
      />
    </span>
  );
}

/** Mirrors the responsive thumbnail collection owned by Image.PreviewGroup. */
export function ImagePreviewGroupSkeleton({
  items = 3,
  aspectRatio,
  radius = "md",
  className,
}: ImagePreviewGroupSkeletonProps) {
  return (
    <div
      className={cn("cb-image-preview-group cb-image-preview-group--skeleton", className)}
      aria-hidden="true"
    >
      {Array.from({ length: Math.max(0, items) }, (_, itemIndex) => (
        <ImageSkeleton
          key={itemIndex}
          aspectRatio={aspectRatio}
          radius={radius}
        />
      ))}
    </div>
  );
}
