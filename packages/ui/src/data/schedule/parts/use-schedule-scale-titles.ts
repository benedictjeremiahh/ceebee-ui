import { useEffect, type RefObject } from 'react';

/** SVAR virtualizes scale cells without a full-label tooltip or a scale-cell template. */
export function useScheduleScaleTitles(ref: RefObject<HTMLDivElement | null>, enabled: boolean): void {
  useEffect(() => {
    const root = ref.current;
    if (!root || !enabled) return;
    const update = () => {
      for (const cell of root.querySelectorAll('.wx-scale .wx-cell')) {
        const label = cell.textContent?.trim();
        if (label && cell.getAttribute('title') !== label) cell.setAttribute('title', label);
      }
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [ref, enabled]);
}
