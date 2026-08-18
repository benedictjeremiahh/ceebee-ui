import type { ReactNode } from 'react';
import { cn, type Tone } from '../lib/cn.js';

export interface TextProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  tone?: Tone | 'muted' | 'subtle';
  weight?: 'regular' | 'medium' | 'semibold';
  as?: 'p' | 'span' | 'div';
  numeric?: boolean;
  className?: string;
  children?: ReactNode;
}

export function Text({
  size = 'md',
  tone = 'neutral',
  weight = 'regular',
  as: Tag = 'p',
  numeric = false,
  className,
  children,
}: TextProps) {
  return (
    <Tag
      className={cn('cb-text', `cb-text--${size}`, `cb-weight--${weight}`, numeric && 'cb-numeric', className)}
      data-tone={tone}
    >
      {children}
    </Tag>
  );
}

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4;
  size?: 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  children?: ReactNode;
}

/** Level and size are separate on purpose: document structure is not a font size. */
export function Heading({ level = 2, size, className, children }: HeadingProps) {
  const Tag = `h${level}` as const;
  const resolved = size ?? (['3xl', '2xl', 'xl', 'lg'] as const)[level - 1] ?? 'lg';
  return <Tag className={cn('cb-heading', `cb-text--${resolved}`, className)}>{children}</Tag>;
}
