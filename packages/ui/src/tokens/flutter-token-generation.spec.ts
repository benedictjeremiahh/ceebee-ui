import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { delimiter, resolve } from 'node:path';

const rootPath = new URL('../../../../', import.meta.url).pathname.replace(/^\/@fs(?=\/)/, '');
const root = resolve(decodeURIComponent(rootPath));

describe('Flutter token generation', () => {
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
