'use client';

import type { ReactNode } from 'react';
import { useMotionSettings } from '@ceebee/ui/client';
import { CodeBlock } from './code-block';

/** How the stage arranges what it is showing. */
export type DemoLayout = 'row' | 'block' | 'grid';

export interface DemoStageProps {
  children: ReactNode;
  /** `block` when the example needs full width (tables, dashboards) rather than a row of controls. */
  layout?: DemoLayout;
  /**
   * Makes the stage the containing block for `position: fixed` children, so a viewport-anchored
   * component (FloatButton) demonstrates itself inside the example instead of escaping to the
   * corner of the docs page.
   */
  contain?: boolean;
  /**
   * Gives the stage its own scroll container, so `position: sticky` children (Affix) have
   * something to stick to. Without it a sticky example renders as an ordinary block and shows
   * nothing at all.
   */
  scroll?: boolean;
}

/**
 * The frame every example is shown in. It exists once so that a demo written in MDX and a demo
 * written as a React component are the same object on the page — same padding, same background,
 * same containment rules — rather than each page inventing its own.
 */
export function DemoStage({ children, layout = 'row', contain, scroll }: DemoStageProps) {
  return (
    <div
      className="demo__stage"
      data-layout={layout}
      data-contain={contain || undefined}
      data-scroll={scroll || undefined}
    >
      {scroll ? <div className="demo__scroller">{children}</div> : children}
    </div>
  );
}

export interface DemoProps extends DemoStageProps {
  /** The source the example is claiming to be. Required: an example with no code is half a demo. */
  code: string;
}

export function Demo({ children, code, layout = 'row', contain, scroll }: DemoProps) {
  return (
    <div className="demo">
      <DemoStage layout={layout} contain={contain} scroll={scroll}>
        {children}
      </DemoStage>
      <DemoCode code={code} />
    </div>
  );
}

/**
 * The code pane under a stage. The demo's own frame already carries the border, so this is the
 * bare block; the label reports the motion state the examples are running under, which is the one
 * thing about a live example that the source cannot tell you.
 */
export function DemoCode({ code }: { code: string }) {
  const { enabled } = useMotionSettings();
  return <CodeBlock bare code={code} filename={enabled ? 'tsx · motion on' : 'tsx · reduced motion'} />;
}
