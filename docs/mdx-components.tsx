import type { MDXComponents } from 'mdx/types';
import { Heading, Text } from '@ceebee/ui';

/** The docs are written with the library, so a bad type scale is visible to its author first (ADR 0010). */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <Heading level={1}>{children}</Heading>,
    h2: ({ children }) => <Heading level={2}>{children}</Heading>,
    h3: ({ children }) => <Heading level={3}>{children}</Heading>,
    p: ({ children }) => <Text tone="muted">{children}</Text>,
    ...components,
  };
}
