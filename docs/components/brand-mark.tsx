interface BrandMarkProps {
  className?: string;
  /** Paint the tile with the active skin's brand gradient, or draw the glyph alone in currentColor. */
  variant?: 'tile' | 'mono';
}

/**
 * The Ceebee UI mark: a bracket holding a block — the system framing a component.
 * Colours come from skin tokens, so the mark follows the active skin and colour scheme.
 */
export function BrandMark({ className, variant = 'tile' }: BrandMarkProps) {
  const glyph = variant === 'tile' ? 'var(--cb-fg-on-brand, #fff)' : 'currentColor';

  return (
    <svg className={className} viewBox="0 0 32 32" role="img" aria-label="Ceebee UI" focusable="false">
      {variant === 'tile' ? (
        <>
          <defs>
            <linearGradient id="cb-brandmark" x1="0" y1="0" x2="0.72" y2="0.86">
              <stop offset="0" stopColor="var(--cb-brand-400)" />
              <stop offset="1" stopColor="var(--cb-decor-blue)" />
            </linearGradient>
          </defs>
          <rect width="32" height="32" rx="8.5" fill="url(#cb-brandmark)" />
        </>
      ) : null}
      <path
        d="M18.384 11.616A6.2 6.2 0 1 0 18.384 20.384"
        fill="none"
        stroke={glyph}
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      <rect x="21.3" y="13.4" width="5.2" height="5.2" rx="1.75" fill={glyph} />
    </svg>
  );
}
