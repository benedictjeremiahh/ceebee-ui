'use client';

import { Tooltip } from 'antd';
import type { ReactNode } from 'react';
import { useRef, useState } from 'react';

/**
 * A label that ellipsises in the space it has and, only when it actually does, shows its whole text in a
 * tooltip. Whether it is cut is measured when the pointer or focus reaches it, not on every render, so a
 * list of a thousand options pays nothing until one is looked at. The full text stays the element's content,
 * so the accessible name is never the cut one.
 */
export function TruncatedLabel({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [cut, setCut] = useState(false);
  const measure = () => {
    const element = ref.current;
    if (element) setCut(element.scrollWidth > element.clientWidth);
  };
  return (
    <Tooltip title={cut ? children : undefined} placement="topLeft" mouseEnterDelay={0.3}>
      <span ref={ref} className="cb-select__label" onMouseEnter={measure} onFocus={measure}>
        {children}
      </span>
    </Tooltip>
  );
}
