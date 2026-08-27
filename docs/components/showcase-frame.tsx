'use client';

import { useEffect, useState, type ComponentType } from 'react';
import { App } from '@ceebee/ui/client';
import { ExampleGrid, Demo } from './demo';

/** One documented example, named and described exactly as the upstream documentation names it. */
export interface OfficialDemo {
  file: string;
  title: string;
  description: string;
  Component: ComponentType;
  contain?: boolean;
  /**
   * Frame height in pixels when the upstream documentation marks the demo `iframe`. Those demos
   * measure the viewport, which the docs page is not.
   */
  iframe?: number;
  /** Upstream's `background="grey"`, for demos whose component is white. */
  background?: 'grey';
  /** Upstream's `compact`, for demos that sit flush against the stage. */
  compact?: boolean;
}

export interface ShowcaseProps {
  /** Documentation section this component belongs to, used for the section's docs class names. */
  section: string;
  /** Component slug, matching the directory the demos live in. */
  component: string;
  demos: OfficialDemo[];
  /**
   * The vendored demo files themselves, keyed by file name, from the component's
   * `sources.generated.ts`. A source pane has to show the code that is running, and these demos are
   * copied into this repository rather than generated, so the listing is the file itself.
   */
  sources: Record<string, string>;
  /**
   * Upstream declares two columns for components whose examples read as a waterfall; the rest run
   * full width. Passing that value keeps a page's card flow faithful to the source documentation.
   */
  cols?: 1 | 2;
}

/**
 * The shared frame for a section's examples. Each component owns its own showcase
 * module and imports only its own demos, so a page carries one component's examples rather than the
 * whole section's.
 */
export function Showcase({ section, component, demos, sources, cols = 1 }: ShowcaseProps) {
  const examples = demos.map(({ file, title, description, Component, contain, iframe, background, compact }) => (
    <Demo
      key={file}
      title={title}
      description={description}
      code={sources[file] ?? ''}
      layout="block"
      contain={contain && !iframe}
      iframeSrc={iframe ? `/internal/demo/${component}/${file}` : undefined}
      iframeHeight={iframe}
      background={background}
      compact={compact}
    >
      {iframe ? null : <ClientOnly Component={Component} />}
    </Demo>
  ));

  return (
    // Every demo renders inside <App>, whose element carries the theme hash and CSS-variable classes
    // the runtime's reset is scoped to. Without it a bare demo anchor loses its link colour and
    // pointer cursor and falls back to the browser default.
    <App className="docs__app-frame">
      <div className={`docs__${section}-examples docs__${section}-${component}`}>
        {cols === 2
          ? <ExampleGrid>{examples}</ExampleGrid>
          : <div className="docs__example-stack">{examples}</div>}
      </div>
    </App>
  );
}

/**
 * Demos read from the DOM and from browser APIs on mount, so they render after hydration rather
 * than during the server pass.
 */
function ClientOnly({ Component }: { Component: ComponentType }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <Component /> : null;
}
