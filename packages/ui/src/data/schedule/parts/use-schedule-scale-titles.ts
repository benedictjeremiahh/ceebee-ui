import { useEffect, useState, type RefObject } from 'react';

/** SVAR virtualizes scale cells without a full-label tooltip or a scale-cell template. */
export function useScheduleScaleTitles(ref: RefObject<HTMLDivElement | null>, enabled: boolean): string[] {
  const [clippedLabels, setClippedLabels] = useState<string[]>([]);

  useEffect(() => {
    const root = ref.current;
    if (!root || !enabled) {
      setClippedLabels((current) => current.length === 0 ? current : []);
      return;
    }
    const scheduleRoot = root;

    const observed = new Set<Element>();
    const resizeObserver = new ResizeObserver(update);

    function update() {
      const nextLabels = new Set<string>();
      const currentSpans = new Set<Element>();
      for (const cell of scheduleRoot.querySelectorAll<HTMLElement>('.wx-scale .wx-cell')) {
        const fullLabel = cell.textContent?.trim();
        if (fullLabel && cell.getAttribute('title') !== fullLabel) cell.setAttribute('title', fullLabel);

        for (const span of cell.querySelectorAll<HTMLElement>(':scope > span')) {
          currentSpans.add(span);
          if (!observed.has(span)) {
            observed.add(span);
            resizeObserver.observe(span);
          }
          const label = span.textContent?.trim();
          if (label && span.scrollWidth > span.clientWidth) nextLabels.add(label);
        }
      }

      for (const span of observed) {
        if (!currentSpans.has(span)) {
          resizeObserver.unobserve(span);
          observed.delete(span);
        }
      }

      const labels = [...nextLabels];
      setClippedLabels((current) =>
        current.length === labels.length && current.every((label, index) => label === labels[index]) ? current : labels
      );
    }

    resizeObserver.observe(scheduleRoot);
    update();
    const mutationObserver = new MutationObserver(update);
    mutationObserver.observe(scheduleRoot, { childList: true, characterData: true, subtree: true });
    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      observed.clear();
    };
  }, [ref, enabled]);

  return clippedLabels;
}
