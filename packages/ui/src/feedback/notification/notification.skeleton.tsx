export interface NotificationSkeletonProps {
  lines?: number;
  withActions?: boolean;
}

export function NotificationSkeleton({ lines = 2, withActions = false }: NotificationSkeletonProps) {
  const safeLines = Number.isFinite(lines) ? Math.max(0, Math.floor(lines)) : 2;

  return (
    <section className="cb-notification cb-notification--skeleton" aria-hidden="true">
      <span className="cb-skeleton cb-notification__skeleton-icon" />
      <div className="cb-notification__content">
        <span className="cb-skeleton cb-notification__skeleton-title" />
        {Array.from({ length: safeLines }, (_, index) => (
          <span
            className="cb-skeleton cb-notification__skeleton-line"
            data-last={index === safeLines - 1 || undefined}
            key={index}
          />
        ))}
        {withActions ? (
          <div className="cb-notification__actions">
            <span className="cb-skeleton cb-notification__skeleton-action" />
          </div>
        ) : null}
      </div>
    </section>
  );
}

