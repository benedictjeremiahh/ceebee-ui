import { readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CSS_GROUPS, CSS_ORDERED } from '../css-groups.mjs';

const SRC = join(process.cwd(), 'packages/ui/src');

function cssFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return cssFiles(path);
    return entry.name.endsWith('.css') ? [relative(SRC, path)] : [];
  });
}

describe('the stylesheet bundle', () => {
  it('reaches every component stylesheet — a CSS file outside the bundled folders never ships', () => {
    const allowed = new Set([...CSS_GROUPS, ...CSS_ORDERED]);
    expect(cssFiles(SRC).filter((file) => !allowed.has(file.split(sep)[0] ?? ''))).toEqual([]);
  });
});
