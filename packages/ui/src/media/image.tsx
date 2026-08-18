'use client';

import { useState, type CSSProperties } from 'react';
import { cn } from '../lib/cn.js';

export interface ImageProps {
  src: string;
  /** Empty string is allowed, and means "decorative" — but it has to be said out loud. */
  alt: string;
  /** Width / height, e.g. 16 / 9. Reserves the space so nothing below it jumps. */
  aspectRatio?: number;
  /** A tiny data URI, blurred up while the real image loads. */
  blurDataUrl?: string;
  /** Flat colour to sit behind the image when there is no blur placeholder. */
  background?: string;
  fit?: 'cover' | 'contain';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: 'lazy' | 'eager';
  className?: string;
}

/**
 * An `<img>` that reserves its space and fades in. It is not a Next.js Image and does not want to
 * be: no resizing service, no loader — those belong to the framework the app already chose.
 */
export function Image({
  src,
  alt,
  aspectRatio,
  blurDataUrl,
  background,
  fit = 'cover',
  radius = 'md',
  loading = 'lazy',
  className,
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  const style = {
    ...(aspectRatio ? { aspectRatio: String(aspectRatio) } : {}),
    ...(background ? { background } : {}),
    ...(blurDataUrl ? { backgroundImage: `url(${blurDataUrl})` } : {}),
  } as CSSProperties;

  return (
    <span
      className={cn('cb-image', `cb-radius--${radius}`, className)}
      data-loaded={loaded || undefined}
      data-blurred={blurDataUrl ? '' : undefined}
      style={style}
    >
      <img
        className="cb-image__img"
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        style={{ objectFit: fit }}
        onLoad={() => setLoaded(true)}
        // A cached image can finish before React attaches onLoad; this catches that case.
        ref={(node) => {
          if (node?.complete) setLoaded(true);
        }}
      />
    </span>
  );
}
