import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(
  join(process.cwd(), 'packages/ui/src/theme/ant-runtime.css'),
  'utf8',
).replace(/\/\*[\s\S]*?\*\//g, '');

describe('the Ant runtime skin bridge', () => {
  it('gives every Tag substrate one token-derived geometry floor', () => {
    expect(source).toMatch(/:where\(\.ant-tag\)/);
    expect(source).toMatch(
      /min-height:\s*calc\(var\(--cb-control-height-sm\) - var\(--cb-space-1\)\)/,
    );
  });

  it('introduces no raw colour, spacing, radius, duration, or easing value', () => {
    const values = [...source.matchAll(/^\s*[\w-]+:\s*([^;]+);/gm)]
      .map((match) => match[1]!.trim());
    const raw = values.filter((value) => (
      /#[0-9a-f]{3,8}\b|oklch\(|rgba?\(|\d+px|\d*\.?\d+rem|\d+m?s\b|cubic-bezier\(/i.test(value)
    ));

    expect(raw, `raw values: ${raw.join(' | ')}`).toEqual([]);
  });
});
