import { Container, type ContainerProps } from '../layout.js';

export interface PageContainerSkeletonProps { breadcrumb?: boolean; subtitle?: boolean; extra?: boolean; tabs?: boolean; lines?: number; containerSize?: ContainerProps['size']; }
export function PageContainerSkeleton({ breadcrumb = true, subtitle = true, extra = true, tabs = false, lines = 4, containerSize = 'lg' }: PageContainerSkeletonProps) {
  return <Container size={containerSize}><section className="cb-page-container cb-page-container--skeleton" aria-hidden="true">{breadcrumb ? <span className="cb-page-container__skeleton-breadcrumb" /> : null}<header className="cb-page-container__header"><div className="cb-page-container__heading"><span className="cb-page-container__skeleton-title" />{subtitle ? <span className="cb-page-container__skeleton-subtitle" /> : null}</div>{extra ? <span className="cb-page-container__skeleton-extra" /> : null}</header>{tabs ? <span className="cb-page-container__skeleton-tabs" /> : null}{Array.from({ length: lines }, (_, index) => <span className="cb-page-container__skeleton-line" key={index} />)}</section></Container>;
}
