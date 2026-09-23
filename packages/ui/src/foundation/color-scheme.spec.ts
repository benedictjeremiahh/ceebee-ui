import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * The browser draws its own chrome (scrollbars, pickers, autofill) in whichever scheme the document
 * declares. A dark theme that forgets to declare it gets light scrollbars on dark surfaces — the
 * white-track pill this file exists to prevent.
 */
const css = readFileSync(join(process.cwd(), 'packages/ui/src/foundation/color-scheme.css'), 'utf8');
const block = (selector: string) => {
  const at = css.indexOf(`${selector} {`);
  if (at < 0) throw new Error(`missing rule: ${selector}`);
  return css.slice(at, css.indexOf('}', at));
};

describe('color-scheme follows the theme', () => {
  it('declares dark for the system dark theme and for an explicit dark choice', () => {
    expect(block(':root:not([data-theme="light"])')).toContain('color-scheme: dark');
    expect(block(':root[data-theme="dark"]')).toContain('color-scheme: dark');
  });

  it('keeps light for the base and for an explicit light choice', () => {
    expect(block(':root[data-theme="light"]')).toContain('color-scheme: light');
    expect(css.slice(0, css.indexOf('@media'))).toContain('color-scheme: light');
  });

  it('colours scrollbars from the theme, with no track, and hands them back to the system in forced colours', () => {
    expect(css).toMatch(/scrollbar-color:\s*color-mix\(in oklch, var\(--cb-fg\)[^;]*\)\s+transparent;/);
    expect(css).toMatch(/@media \(forced-colors: active\)[\s\S]*scrollbar-color:\s*auto/);
  });
});
