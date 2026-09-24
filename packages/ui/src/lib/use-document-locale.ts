'use client';

import { useEffect, useState } from 'react';

/**
 * The language to write dates in: the prop when a consumer gives one, otherwise the document's `lang`.
 *
 * Read after mount rather than during render, because a server render has no document — choosing one there
 * would hydrate a different string from the one the page was rendered with, and a date that changes its
 * words on hydration is the kind of mismatch React answers by throwing the tree away.
 *
 * In `lib` rather than inside one component because it is not about charts: every date this library prints
 * for a person has to agree with every other about which language that person reads.
 */
export function useDocumentLocale(given?: string): string {
  const [lang, setLang] = useState('en');
  useEffect(() => setLang(document.documentElement.lang || 'en'), []);
  return given ?? lang;
}
