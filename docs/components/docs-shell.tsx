'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Nav } from './nav';
import { PageToc } from './page-toc';
import { Toolbar } from './toolbar';

export function DocsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith('/internal/demo/')) {
    return <main className="docs__isolated-demo">{children}</main>;
  }

  return (
    <div className="docs">
      <Nav />
      <main className="docs__main">
        <Toolbar />
        <div className="docs__page-grid">
          <div className="docs__content">{children}</div>
          <PageToc />
        </div>
      </main>
    </div>
  );
}
