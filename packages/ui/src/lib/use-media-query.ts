'use client';

import * as React from 'react';

/** A media query's answer, or false wherever the browser cannot answer one. */
export function useMediaQuery(query: string | null): boolean {
  const [matches, setMatches] = React.useState(false);
  React.useEffect(() => {
    if (!query || typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const read = () => setMatches(mql.matches);
    read();
    mql.addEventListener('change', read);
    return () => mql.removeEventListener('change', read);
  }, [query]);
  return matches;
}
