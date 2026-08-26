// Concatenates the library's CSS into one stylesheet in a deterministic order:
// tokens first (they define every custom property), then components.
// Components are plain `cb-`-prefixed CSS, so no scoping step exists (ADR 0002).
import { readdir, readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { join } from 'node:path';

const SRC = new URL('./src/', import.meta.url).pathname;
const DIST = new URL('./dist/', import.meta.url).pathname;

const TOKEN_ORDER = ['structure.css', 'skin.css', 'motion.css'];
const GROUPS = ['foundation', 'form', 'feedback', 'overlay', 'data', 'media', 'nav', 'motion', 'onboarding', 'theme'];

async function cssFilesIn(dir) {
  const root = join(SRC, dir);
  const files = [];

  async function visit(current) {
    const entries = await readdir(current, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) await visit(path);
      if (entry.isFile() && entry.name.endsWith('.css')) files.push(path);
    }
  }

  await visit(root);
  return files.sort();
}

const files = [
  ...TOKEN_ORDER.map((name) => join(SRC, 'tokens', name)),
  ...(await Promise.all(GROUPS.map(cssFilesIn))).flat(),
];

const chunks = [];
for (const file of files) {
  chunks.push(`/* ${file.slice(SRC.length)} */\n${await readFile(file, 'utf8')}`);
}

await mkdir(DIST, { recursive: true });
await writeFile(join(DIST, 'styles.css'), chunks.join('\n'), 'utf8');

await mkdir(join(DIST, 'skins'), { recursive: true });
for (const skin of await readdir(join(SRC, 'skins'))) {
  await copyFile(join(SRC, 'skins', skin), join(DIST, 'skins', skin));
}

console.log(`styles.css written from ${files.length} files`);
