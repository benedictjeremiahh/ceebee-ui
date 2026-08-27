import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const structure = readFileSync(join(process.cwd(), 'packages/ui/src/tokens/structure.css'), 'utf8');

function token(name: string) {
  const match = structure.match(new RegExp(`--cb-z-${name}:\\s*(\\d+)`));
  if (!match) throw new Error(`missing stacking token: ${name}`);
  return Number(match[1]);
}

describe('global stacking contract', () => {
  it('orders semantic interaction layers from page chrome through guided overlays', () => {
    const order = [
      'base',
      'sticky',
      'modal-backdrop',
      'modal',
      'dropdown',
      'popover',
      'tooltip',
      'command-backdrop',
      'command',
      'toast',
      'coachmark-spotlight',
      'coachmark',
    ].map(token);

    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(new Set(order).size).toBe(order.length);
  });

  it('assigns anchored layers to the Positioner that owns their stacking context', () => {
    // Only the components this library still draws anchor their own layers; Ant owns the rest.
    const positioners = [
      ['nav/shell.tsx', 'cb-sidebar__flyout-positioner'],
    ] as const;

    for (const [file, className] of positioners) {
      const source = readFileSync(join(process.cwd(), 'packages/ui/src', file), 'utf8');
      expect(source, `${file} must layer its Positioner`).toMatch(
        new RegExp(`<Base\\w+\\.Positioner[^>]*className="${className}"[^>]*>`),
      );
    }
  });
});
