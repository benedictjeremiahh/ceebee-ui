export interface PopconfirmSkeletonProps {
  withDescription?: boolean;
  withCancel?: boolean;
}

/** Static loading geometry matching the anchored confirmation surface. */
export function PopconfirmSkeleton({
  withDescription = true,
  withCancel = true,
}: PopconfirmSkeletonProps) {
  return (
    <div className="cb-popconfirm cb-popconfirm--skeleton" aria-hidden="true">
      <span className="cb-skeleton cb-popconfirm__skeleton-icon" />
      <div className="cb-popconfirm__content">
        <span className="cb-skeleton cb-popconfirm__skeleton-title" />
        {withDescription ? <span className="cb-skeleton cb-popconfirm__skeleton-description" /> : null}
        <div className="cb-popconfirm__actions">
          {withCancel ? <span className="cb-skeleton cb-popconfirm__skeleton-action" /> : null}
          <span className="cb-skeleton cb-popconfirm__skeleton-action" />
        </div>
      </div>
    </div>
  );
}

