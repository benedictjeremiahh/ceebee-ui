import { useEffect, useState, type RefObject } from 'react';

function borderColorAsHex(element: HTMLElement): string | null {
  const color = getComputedStyle(element).getPropertyValue('--wx-gantt-border-color').trim();
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context || !color) return null;

  // SVAR extracts the first `#` from --wx-gantt-border for its calendar-grid image.
  // Canvas resolves our token's OKLCH color without duplicating the skin palette in hex.
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const channels = context.getImageData(0, 0, 1, 1).data;
  return `#${Array.from(channels).map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

export function useScheduleGridColor(ref: RefObject<HTMLDivElement | null>, enabled: boolean): string | null {
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    const update = () => {
      const next = borderColorAsHex(element);
      if (next) element.style.setProperty('--wx-gantt-border', `var(--cb-border-width) solid ${next}`);
      setColor(next);
    };
    const observer = new MutationObserver(update);
    for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
      observer.observe(ancestor, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] });
    }
    const systemTheme = typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null;
    systemTheme?.addEventListener('change', update);
    update();
    return () => {
      element.style.removeProperty('--wx-gantt-border');
      observer.disconnect();
      systemTheme?.removeEventListener('change', update);
    };
  }, [ref, enabled]);

  return color;
}
