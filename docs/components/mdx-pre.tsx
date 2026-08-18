import type { ReactNode } from 'react';
import { CodeBlock } from './code-block';

/**
 * Deliberately a server component. MDX gives a fence's text to whatever renders it, but a client
 * component receives that tree already serialised, so the same extraction returns an empty string
 * in the browser and hydration then wipes the block the server rendered correctly. Extracting
 * here and handing the client a plain string avoids the whole problem.
 */
function textOf(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(textOf).join('');
  const element = node as { props?: { children?: ReactNode } } | null;
  return element?.props?.children ? textOf(element.props.children) : '';
}

export function MdxPre({ children }: { children?: ReactNode }) {
  const child = children as { props?: { children?: ReactNode; className?: string } } | undefined;
  const code = textOf(child?.props?.children);
  const language = child?.props?.className?.replace('language-', '') ?? 'tsx';
  return <CodeBlock code={code} language={language} />;
}
