import { useEffect, type RefObject } from 'react';

/** Gives SVAR's column resize handles the consumer's accessible label. */
export function useScheduleColumnLabels(
  ref: RefObject<HTMLDivElement | null>,
  enabled: boolean,
  resizeLabel: string,
): void {
  useEffect(() => {
    const root = ref.current;
    if (!root || !enabled || !root.isConnected) return;

    const update = () => {
      if (!root.isConnected) return;
      for (const handle of root.querySelectorAll('.wx-header .wx-grip[aria-label]')) {
        if (handle.getAttribute('aria-label') !== resizeLabel) {
          handle.setAttribute('aria-label', resizeLabel);
        }
      }
    };

    update();
    const observer = new MutationObserver(update);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['aria-label'],
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, [ref, enabled, resizeLabel]);
}
