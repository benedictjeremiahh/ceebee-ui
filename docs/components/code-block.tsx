'use client';

import { Check, Copy } from 'lucide-react';
import { Highlight, type PrismTheme } from 'prism-react-renderer';
import { useState, type ReactNode } from 'react';

/**
 * The syntax theme is written in design tokens rather than literal colours, so highlighting
 * follows the active theme and skin instead of being a second, unrelated palette.
 */
const theme: PrismTheme = {
  plain: { color: 'var(--cb-fg)', backgroundColor: 'transparent' },
  styles: [
    { types: ['comment', 'prolog', 'cdata'], style: { color: 'var(--cb-fg-subtle)', fontStyle: 'italic' } },
    { types: ['punctuation', 'operator'], style: { color: 'var(--cb-fg-muted)' } },
    { types: ['keyword', 'boolean', 'builtin'], style: { color: 'var(--cb-decor-violet)' } },
    { types: ['string', 'char', 'attr-value', 'inserted'], style: { color: 'var(--cb-decor-green)' } },
    { types: ['function', 'class-name', 'maybe-class-name'], style: { color: 'var(--cb-decor-blue)' } },
    { types: ['number', 'constant', 'symbol'], style: { color: 'var(--cb-decor-amber)' } },
    { types: ['tag', 'deleted'], style: { color: 'var(--cb-decor-rose)' } },
    { types: ['attr-name', 'property'], style: { color: 'var(--cb-decor-teal)' } },
  ],
};

export interface CodeBlockProps {
  code: string;
  language?: string;
  /** Shown in the header instead of the language chip. */
  filename?: string;
  /** Drops the header entirely — for the code pane under a live demo. */
  bare?: boolean;
}

/**
 * Strips the indentation the surrounding source file happened to have. Without it every example
 * is published with however many spaces the JSX around the template literal was sitting at.
 */
function dedent(code: string): string {
  const lines = code.replace(/\t/g, '  ').split('\n');
  const indents = lines.filter((line) => line.trim()).map((line) => line.match(/^ */)![0].length);
  const shortest = indents.length > 0 ? Math.min(...indents) : 0;
  return lines
    .map((line) => line.slice(shortest))
    .join('\n')
    .replace(/^\n+|\s+$/g, '');
}

export function CodeBlock({ code, language = 'tsx', filename, bare = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const source = dedent(code);

  return (
    <div className="code" data-bare={bare || undefined}>
      <div className="code__bar">
        <span className="code__label">{filename ?? language}</span>
        <button
          type="button"
          className="code__copy"
          aria-label={copied ? 'Copied' : 'Copy code'}
          onClick={() => {
            void navigator.clipboard.writeText(source);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <Highlight code={source} language={language} theme={theme}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="code__pre">
            <code>
              {tokens.map((line, index) => (
                <span key={index} {...getLineProps({ line, className: 'code__line' })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}

