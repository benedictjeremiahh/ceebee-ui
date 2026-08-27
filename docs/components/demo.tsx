'use client';

import { Code2 } from 'lucide-react';
import { Children, useEffect, useId, useState, type CSSProperties, type ReactNode } from 'react';
import { useMotionSettings, useTheme } from '@ceebee/ui/client';
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
  /** Internal presentation seam for isolated upstream demos. */
  iframe?: boolean;
  /**
   * Upstream marks a demo `background="grey"` when the component it shows is white: a borderless
   * Card or a Statistic card is invisible against a white stage, and the grey backdrop is what makes
   * its edges readable.
   */
  background?: 'grey';
  /** Upstream marks a demo `compact` when it should sit flush against the stage, without padding. */
  compact?: boolean;
}

/**
 * The frame every example is shown in. It exists once so that a demo written in MDX and a demo
 * written as a React component are the same object on the page — same padding, same background,
 * same containment rules — rather than each page inventing its own.
 */
export function DemoStage({ children, layout = 'row', contain, scroll, iframe, background, compact }: DemoStageProps) {
  return (
    <div
      className="demo__stage"
      data-layout={layout}
      data-contain={contain || undefined}
      data-scroll={scroll || undefined}
      data-iframe={iframe || undefined}
      data-background={background}
      data-compact={compact || undefined}
    >
      {scroll ? <div className="demo__scroller">{children}</div> : children}
    </div>
  );
}

export interface DemoProps extends DemoStageProps {
  /** The source the example is claiming to be. Required: an example with no code is half a demo. */
  code: string;
  /** Visible example name, matching the source documentation when the demo mirrors an upstream example. */
  title?: ReactNode;
  /** Short explanation of the behavior demonstrated by the example. */
  description?: ReactNode;
  /** Isolates a viewport-relative demo in a browser-frame presentation of its own. */
  iframeSrc?: string;
  /** The frame height the upstream documentation declares for an isolated demo, in pixels. */
  iframeHeight?: number;
}

/** Two-column example flow that keeps the authored order on compact viewports. */
export function ExampleGrid({ children }: { children: ReactNode }) {
  const examples = Children.toArray(children);
  return (
    <div className="docs__example-grid">
      {[0, 1].map((column) => (
        <div className="docs__example-column" key={column}>
          {examples.map((example, index) => index % 2 === column ? (
            <div
              className="docs__example-item"
              key={index}
              style={{ '--docs-example-order': index } as CSSProperties}
            >
              {example}
            </div>
          ) : null)}
        </div>
      ))}
    </div>
  );
}

export function Demo({ children, code, title, description, layout = 'row', contain, scroll, iframeSrc, iframeHeight, background, compact }: DemoProps) {
  const [sourceOpen, setSourceOpen] = useState(false);
  const sourceId = useId();

  return (
    <div className="demo docs__demo">
      <DemoStage layout={layout} contain={contain && !iframeSrc} scroll={scroll} iframe={Boolean(iframeSrc)} background={background} compact={compact}>
        {iframeSrc ? <BrowserFrame src={iframeSrc} height={iframeHeight} title={typeof title === 'string' ? title : 'Demo'} /> : children}
      </DemoStage>
      {(title || description) ? (
        <div className="demo__meta" data-has-title={title ? true : undefined}>
          {title ? <h3 className="demo__title">{title}</h3> : null}
          {description ? <p className="demo__description">{description}</p> : null}
        </div>
      ) : null}
      <div className="demo__actions">
        <button
          type="button"
          className="demo__action"
          aria-controls={sourceId}
          aria-expanded={sourceOpen}
          aria-label={sourceOpen ? 'Hide source code' : 'Show source code'}
          title={sourceOpen ? 'Hide source code' : 'Show source code'}
          onClick={() => setSourceOpen((current) => !current)}
        >
          <Code2 aria-hidden="true" />
        </button>
      </div>
      {sourceOpen ? <div id={sourceId}><DemoCode code={code} /></div> : null}
    </div>
  );
}

function BrowserFrame({ src, height, title }: { src: string; height?: number; title: string }) {
  const { resolved } = useTheme();
  const [skin, setSkin] = useState('default');

  useEffect(() => {
    const refresh = () => {
      const href = document.getElementById('cb-skin')?.getAttribute('href') ?? '';
      setSkin(href.match(/\/skins\/([^/.]+)\.css/)?.[1] ?? 'default');
    };
    refresh();
    const observer = new MutationObserver(refresh);
    observer.observe(document.head, { childList: true });
    return () => observer.disconnect();
  }, []);

  const separator = src.includes('?') ? '&' : '?';
  return (
    <div className="demo__browser-frame">
      <div className="demo__browser-toolbar" aria-hidden="true">
        <span className="demo__browser-dot demo__browser-dot--danger" />
        <span className="demo__browser-dot demo__browser-dot--warning" />
        <span className="demo__browser-dot demo__browser-dot--success" />
        <span className="demo__browser-address" />
      </div>
      <iframe
        className="demo__browser-viewport"
        style={height ? ({ '--docs-demo-iframe-height': `${height}px` } as CSSProperties) : undefined}
        src={`${src}${separator}theme=${resolved}&skin=${skin}`}
        title={`${title} demo`}
      />
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
