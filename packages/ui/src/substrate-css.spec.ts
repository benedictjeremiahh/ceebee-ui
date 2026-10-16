import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { withoutFontFaceRules } from '../substrate-css.mjs';

const require = createRequire(resolve(process.cwd(), 'packages/ui/build-css.mjs'));

describe('withoutFontFaceRules', () => {
  it('keeps neighboring layout and media rules unchanged', () => {
    const before = '.grid { display: grid; }\n';
    const between = '@media (width > 1px) { .row { display: flex; } }\n';
    const after = '.cell { color: var(--fg); }';
    const regular = '@font-face { font-family: Remote; src: url(https://example.test/font.woff2); }';
    const bold = '@FONT-FACE\n{font-family: Remote; font-weight: 700; src: url(font-bold.woff2);}';
    expect(withoutFontFaceRules(before + regular + between + bold + after)).toBe(before + between + after);
    expect(withoutFontFaceRules(before + between + after)).toBe(before + between + after);
  });

  it('omits SVAR font faces and preserves every other source byte', () => {
    const vendorPath = require.resolve('@svar-ui/react-gantt/all.css');
    const source = readFileSync(vendorPath, 'utf8');
    const originalFontFaces = source.match(/@font-face\s*\{[^{}]*\}/gi) ?? [];

    expect(originalFontFaces).toHaveLength(6);

    const filtered = withoutFontFaceRules(source);
    const expected = source.split(/@font-face/i)
      .map((part, index) => index === 0 ? part : part.slice(part.indexOf('}') + 1)).join('');

    expect(filtered).toBe(expected);
    expect(filtered).not.toMatch(/@font-face\s*\{/i);
    expect(filtered).not.toContain('cdn.svar.dev/fonts/');
    expect(readFileSync(vendorPath, 'utf8')).toBe(source);
  });
});
