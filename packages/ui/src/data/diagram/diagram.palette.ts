/**
 * Where a node asked for from the palette lands, in whole cells (ceebee-ui#44). The node is centred on the
 * point — where it was dropped, or the middle of what is visible — rather than hung from its top-left corner,
 * so it appears under the pointer, not below and to the right of it. The slot sizes are the stylesheet's:
 * 8×3 cells, 4×4 for a diamond.
 */
import type { Tone } from '../../lib/cn.js';
import type { DiagramPosition, DiagramShape } from './diagram.types.js';

export interface DiagramPaletteItem {
  /** What the caller calls this kind of node; handed back in the add request. */
  kind: string;
  label: string;
  shape: DiagramShape;
  tone?: Tone;
  /** What this kind means — shown as the item's tooltip and read as its description. */
  description?: string;
}

export interface DiagramAddRequest {
  kind: string;
  /** The new node's position in whole cells. */
  position: DiagramPosition;
}

/** The drag payload's type, so a drop from anything else is not read as a palette item. */
export const PALETTE_MIME = 'application/x-cb-diagram-kind';

export function slotOf(shape: DiagramShape): { columns: number; rows: number } {
  return shape === 'diamond' ? { columns: 4, rows: 4 } : { columns: 8, rows: 3 };
}

/** The cell a node of `shape` takes so that its centre sits on `point` (in diagram pixels). */
export function landingCell(point: DiagramPosition, cell: number, shape: DiagramShape): DiagramPosition {
  const { columns, rows } = slotOf(shape);
  return { x: Math.round(point.x / cell - columns / 2), y: Math.round(point.y / cell - rows / 2) };
}
