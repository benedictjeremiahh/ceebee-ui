import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Worksheet } from './worksheet.js';
import type { WorksheetColumn } from './worksheet.types.js';

interface Row { id: string; name: string }
const columns: readonly WorksheetColumn<Row>[] = [{ key: 'name', name: 'Name' }];
const ab: readonly Row[] = [{ id: 'a', name: 'Alpha' }, { id: 'b', name: 'Bravo' }];
const ba: readonly Row[] = [ab[1] ?? { id: 'b', name: 'Bravo' }, ab[0] ?? { id: 'a', name: 'Alpha' }];

// jsdom has no layout: a row is drawn at ten pixels per row index, the grid at the origin.
const initialRect = Element.prototype.getBoundingClientRect;
const initialMatchMedia = window.matchMedia;
beforeEach(() => {
  Element.prototype.getBoundingClientRect = function measure(this: Element) {
    const top = Number(this.getAttribute('aria-rowindex') ?? 0) * 10;
    return { top, bottom: top + 10, left: 0, right: 100, width: 100, height: 10, x: 0, y: top, toJSON: () => ({}) };
  };
});
afterEach(() => {
  Element.prototype.getBoundingClientRect = initialRect;
  window.matchMedia = initialMatchMedia;
});

function reducedMotion(matches: boolean) {
  window.matchMedia = query => ({
    matches: matches && query.includes('reduce'), media: query, onchange: null,
    addEventListener: () => undefined, removeEventListener: () => undefined,
    addListener: () => undefined, removeListener: () => undefined, dispatchEvent: () => false,
  });
}

function sheet(rows: readonly Row[], extra: { isPlaceholderRow?: (row: Row) => boolean; rowClass?: (row: Row) => string | undefined } = {}) {
  return <Worksheet label="Order" rows={rows} columns={columns} rowKeyGetter={row => row.id} enableVirtualization={false}
    animateRowOrder {...extra} />;
}
const rowOf = (container: HTMLElement, name: string) => [...container.querySelectorAll('.rdg-row')]
  .find(row => row.textContent?.includes(name));

describe('Worksheet row order', () => {
  it('moves a reordered row from where it was drawn to its new place', () => {
    reducedMotion(false);
    const { container, rerender } = render(sheet(ab));
    rerender(sheet(ba));
    expect(rowOf(container, 'Alpha')).toHaveClass('cb-worksheet__row--moving');
    expect(rowOf(container, 'Bravo')).toHaveClass('cb-worksheet__row--moving');
  });

  it('reorders instantly under reduced motion', () => {
    reducedMotion(true);
    const { container, rerender } = render(sheet(ab));
    rerender(sheet(ba));
    expect(container.querySelector('.cb-worksheet__row--moving')).toBeNull();
    expect(rowOf(container, 'Alpha')?.getAttribute('style') ?? '').not.toContain('transform');
  });

  it('marks the placeholder row beside the consumer row class', () => {
    const { container } = render(sheet(ab, { isPlaceholderRow: row => row.id === 'b', rowClass: () => 'own' }));
    expect(rowOf(container, 'Bravo')).toHaveClass('cb-worksheet__row--placeholder', 'own');
    expect(rowOf(container, 'Alpha')).toHaveClass('own');
    expect(rowOf(container, 'Alpha')).not.toHaveClass('cb-worksheet__row--placeholder');
  });
});
