import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { delimiter, resolve } from 'node:path';
import { antColor, parseColor } from '../../../../scripts/gen-flutter-tokens.mjs';

const rootPath = new URL('../../../../', import.meta.url).pathname.replace(/^\/@fs(?=\/)/, '');
const root = resolve(decodeURIComponent(rootPath));

describe('Flutter token generation', () => {
  it.each([
    ['#EFF5FF', '239, 245, 255'],
    ['#FFFFFF', '255, 255, 255'],
    ['#000000', '0, 0, 0'],
  ])('preserves exact sRGB channels and opaque alpha for %s', (hex, channels) => {
    expect(antColor(hex, 'test')).toBe(`rgba(${channels}, 1)`);
  });

  it('parses a brand-edge hex into an opaque Flutter OKLCH value', () => {
    expect(parseColor('#EFF5FF', 'test')).toBe('CbOklch(0.96851966918315, 0.014848486921673, 260.72974344944)');
    expect(parseColor('#FFFFFF', 'test')).toBe('CbOklch(1.0, 0.0, 0.0)');
    expect(parseColor('#000000', 'test')).toBe('CbOklch(0.0, 0.0, 0.0)');
  });

  it.each(['#FFF', '#FFFFFFF', '#GGFFFF', '#12 456'])('refuses invalid hex colour %s', (value) => {
    expect(() => parseColor(value, 'test')).toThrow('Unsupported colour at test');
    expect(() => antColor(value, 'test')).toThrow('Expected a six-digit hex or oklch colour at test');
  });

  it('accepts the known web-only compact pointer media query in check mode', () => {
    const pathCandidates = (process.env.PATH ?? '').split(delimiter)
      .filter(Boolean)
      .map((directory) => resolve(directory, 'node'));
    const node = [...pathCandidates, process.execPath].find(existsSync);
    if (!node) throw new Error('Could not locate the Node.js executable for the generator check.');

    const result = spawnSync(
      node,
      [resolve(root, 'scripts/gen-flutter-tokens.mjs'), '--check'],
      { cwd: root, encoding: 'utf8' },
    );

    expect(result.error).toBeUndefined();
    expect(result.status, result.stderr || result.stdout).toBe(0);
    expect(result.stdout).toContain('Generated web and Flutter theme artefacts match the CSS Tokens.');
  });
});
