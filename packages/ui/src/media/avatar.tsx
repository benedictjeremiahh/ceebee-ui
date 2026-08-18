import type { ReactNode } from 'react';
import { cn, type DecorHue } from '../lib/cn.js';
import { initialsOf, hueForName } from './avatar.util.js';

export interface AvatarProps {
  /** The person or thing. Used for the accessible name, the initials, and the fallback hue. */
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Overrides the hue derived from the name. */
  hue?: DecorHue;
  /** Presence dot. */
  status?: 'online' | 'busy' | 'away' | 'offline';
  className?: string;
}

/**
 * Server-safe: no image-load state, no hooks. The initials render underneath and the image
 * covers them when it loads, so a broken URL degrades to initials without JavaScript.
 */
export function Avatar({ name, src, size = 'md', hue, status, className }: AvatarProps) {
  return (
    <span
      className={cn('cb-avatar', `cb-avatar--${size}`, className)}
      data-hue={hue ?? hueForName(name)}
      role="img"
      aria-label={name}
    >
      <span className="cb-avatar__initials" aria-hidden="true">
        {initialsOf(name)}
      </span>
      {src ? <img className="cb-avatar__image" src={src} alt="" loading="lazy" /> : null}
      {status ? <span className="cb-avatar__status" data-status={status} aria-hidden="true" /> : null}
    </span>
  );
}

export interface AvatarGroupProps {
  children: ReactNode;
  /** Rendered as "+N" after the stack. */
  overflow?: number;
  size?: AvatarProps['size'];
  className?: string;
}

export function AvatarGroup({ children, overflow, size = 'md', className }: AvatarGroupProps) {
  return (
    <span className={cn('cb-avatar-group', className)}>
      {children}
      {overflow && overflow > 0 ? (
        <span className={cn('cb-avatar', `cb-avatar--${size}`, 'cb-avatar--overflow')}>
          <span className="cb-avatar__initials">+{overflow}</span>
        </span>
      ) : null}
    </span>
  );
}
