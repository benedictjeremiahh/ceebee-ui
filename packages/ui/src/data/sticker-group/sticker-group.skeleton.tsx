export interface StickerGroupSkeletonProps {
  count?: number;
  label?: string;
}

export function StickerGroupSkeleton({ count = 3, label = 'Loading items' }: StickerGroupSkeletonProps) {
  return (
    <div className="cb-sticker-group cb-sticker-group--skeleton" role="status" aria-label={label}>
      {Array.from({ length: count }, (_, index) => (
        <span className="cb-sticker-group__skeleton-item" aria-hidden="true" key={index} />
      ))}
    </div>
  );
}
