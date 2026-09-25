'use client';

import { Tooltip } from 'antd';
import type { DragEvent } from 'react';
import { PALETTE_MIME, type DiagramPaletteItem } from './diagram.palette.js';

/**
 * The kinds of node a person can add, each drawn in its node shape (ceebee-ui#44). Dragging one onto the
 * canvas asks for it where it is dropped. Dragging is not the only way: a tap or Enter asks for it in the
 * middle of what is visible, because a drag-only control fails touch screens and keyboards (WCAG 2.5.7).
 */
export function DiagramPalette({
  items,
  label,
  hint,
  onPick,
}: {
  items: readonly DiagramPaletteItem[];
  label: string;
  hint?: string;
  onPick: (item: DiagramPaletteItem) => void;
}) {
  const start = (event: DragEvent<HTMLButtonElement>, item: DiagramPaletteItem) => {
    event.dataTransfer.setData(PALETTE_MIME, item.kind);
    event.dataTransfer.effectAllowed = 'copy';
  };
  return (
    <div className="cb-diagram__palette" role="group" aria-label={label}>
      {hint ? <span className="cb-diagram__palette-hint">{hint}</span> : null}
      {items.map((item) => (
        <Tooltip key={item.kind} title={item.description}>
          <button
            type="button"
            className="cb-diagram__palette-item"
            draggable
            onDragStart={(event) => start(event, item)}
            onClick={() => onPick(item)}
          >
            <span className="cb-diagram__legend-swatch" data-shape={item.shape} data-tone={item.tone} aria-hidden="true" />
            {item.label}
          </button>
        </Tooltip>
      ))}
    </div>
  );
}
