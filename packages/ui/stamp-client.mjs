// esbuild drops module-level directives when bundling, and tsup's banner does not survive it,
// so the "use client" directive that ADR 0004 depends on is stamped back on afterwards.
// Without it a Next app importing @ceebee/ui/client gets a server-render error, not a warning.
import { readFile, writeFile } from 'node:fs/promises';

const target = new URL('./dist/client.js', import.meta.url);
const source = await readFile(target, 'utf8');

if (source.startsWith('"use client"') || source.startsWith("'use client'")) {
  console.log('client.js already carries the directive');
} else {
  await writeFile(target, `"use client";\n${source}`, 'utf8');
  console.log('stamped "use client" onto dist/client.js');
}

const server = await readFile(new URL('./dist/index.js', import.meta.url), 'utf8');
if (server.includes('use client')) {
  throw new Error('the server entry carries a client directive — the ADR 0004 boundary leaked');
}
