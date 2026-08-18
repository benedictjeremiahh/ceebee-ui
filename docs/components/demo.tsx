'use client';

import type { ReactNode } from 'react';
import { useMotionSettings } from '@ceebee/ui/client';
import { CodeBlock } from './code-block';

export interface DemoProps {
  children: ReactNode;
  code: string;
  /** `block` when the example needs full width (tables, dashboards) rather than a row of controls. */
  layout?: 'row' | 'block';
}

export function Demo({ children, code, layout = 'row' }: DemoProps) {
  const { enabled } = useMotionSettings();

  return (
    <div className="demo">
      <div className="demo__stage" data-layout={layout}>
        {children}
      </div>
      {/* The code block carries its own copy control, so the stage footer only reports the
          motion state the examples are running under. */}
      <CodeBlock bare code={code} filename={enabled ? 'tsx · motion on' : 'tsx · reduced motion'} />
    </div>
  );
}
