/** Matching Result anatomy while the end-state content is loading (ADR 0009). */
export function ResultSkeleton() {
  return (
    <section className="cb-result cb-result--skeleton" aria-hidden="true">
      <span className="cb-skeleton cb-result__skeleton-icon" />
      <span className="cb-skeleton cb-result__skeleton-title" />
      <span className="cb-skeleton cb-result__skeleton-description" />
      <div className="cb-result__skeleton-extra">
        <span className="cb-skeleton cb-result__skeleton-action" />
        <span className="cb-skeleton cb-result__skeleton-action" />
      </div>
    </section>
  );
}
