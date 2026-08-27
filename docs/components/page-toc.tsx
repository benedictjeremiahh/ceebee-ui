'use client';

import { usePathname } from 'next/navigation';
import { Anchor, type AnchorProps } from '@ceebee/ui/client';

type AnchorItem = NonNullable<AnchorProps['items']>[number];
import { useCallback, useEffect, useMemo, useState } from 'react';

interface TocItem {
  id: string;
  label: string;
  level: number;
}

export function PageToc() {
  const pathname = usePathname();
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const headings = Array.from(document.querySelectorAll<HTMLElement>(
        '.docs__content > h2, .docs__content > h3, .docs__content .demo__title',
      ));
      for (const grid of document.querySelectorAll<HTMLElement>('.docs__example-grid')) {
        const indices = headings.flatMap((heading, index) => grid.contains(heading) ? [index] : []);
        const ordered = indices
          .map((index) => headings[index]!)
          .sort((left, right) => demoOrder(left) - demoOrder(right));
        indices.forEach((index, position) => { headings[index] = ordered[position]!; });
      }
      const seen = new Map<string, number>();
      setItems(headings.map((heading) => {
        const base = heading.id || slugify(heading.textContent || 'section');
        const count = seen.get(base) ?? 0;
        seen.set(base, count + 1);
        const id = count === 0 ? base : `${base}-${count + 1}`;
        heading.id = id;
        return { id, label: heading.textContent || id, level: Number(heading.tagName.slice(1)) };
      }));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  const anchorItems = useMemo(() => nestTocItems(items), [items]);
  const getCurrentAnchor = useCallback(
    (activeLink: string) => activeLink || anchorItems[0]?.href || '',
    [anchorItems],
  );

  if (items.length < 2) return null;

  return (
    <aside className="docs__toc" aria-label="On this page">
      <p className="docs__toc-title">On this page</p>
      <Anchor
        affix={false}
        showInkInFixed
        aria-label="Page sections"
        className="docs__toc-anchor"
        getCurrentAnchor={getCurrentAnchor}
        items={anchorItems}
      />
    </aside>
  );
}

function demoOrder(heading: HTMLElement) {
  const item = heading.closest<HTMLElement>('.docs__example-item');
  return Number(item?.style.getPropertyValue('--docs-example-order') || 0);
}

function nestTocItems(items: TocItem[]): AnchorItem[] {
  const roots: AnchorItem[] = [];
  let currentRoot: AnchorItem | undefined;

  for (const item of items) {
    const anchorItem: AnchorItem = { key: item.id, href: `#${item.id}`, title: item.label };
    if (item.level === 2 || !currentRoot) {
      roots.push(anchorItem);
      currentRoot = anchorItem;
    } else {
      currentRoot.children = [...(currentRoot.children ?? []), anchorItem];
    }
  }

  return roots;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
