import type { ReactNode } from 'react';
import { Container, type ContainerProps } from '../layout.js';
import { PageContainerSkeleton, type PageContainerSkeletonProps } from './page-container.skeleton.js';

export interface PageContainerProps {
  breadcrumb?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  extra?: ReactNode;
  tabs?: ReactNode;
  children?: ReactNode;
  containerSize?: ContainerProps['size'];
}

/** Server-safe page frame. Routing, data, title level, action behaviour, and tab state remain external. */
function PageContainerRoot({ breadcrumb, title, subtitle, extra, tabs, children, containerSize = 'lg' }: PageContainerProps) {
  const hasHeader = title != null || subtitle != null || extra != null;
  return (
    <Container size={containerSize}>
      <section className="cb-page-container">
        {breadcrumb != null ? <div className="cb-page-container__breadcrumb">{breadcrumb}</div> : null}
        {hasHeader ? <header className="cb-page-container__header"><div className="cb-page-container__heading">{title != null ? <div className="cb-page-container__title">{title}</div> : null}{subtitle != null ? <div className="cb-page-container__subtitle">{subtitle}</div> : null}</div>{extra != null ? <div className="cb-page-container__extra">{extra}</div> : null}</header> : null}
        {tabs != null ? <div className="cb-page-container__tabs">{tabs}</div> : null}
        {children != null ? <div className="cb-page-container__body">{children}</div> : null}
      </section>
    </Container>
  );
}

export const PageContainer = Object.assign(PageContainerRoot, { Skeleton: PageContainerSkeleton });
export type { PageContainerSkeletonProps };
