// The skin switcher loads a Skin as a stylesheet at runtime, so the library's skins are
// mirrored into /public. Copied rather than imported: the point is to prove a Skin is just CSS.
import { copyFile, mkdir, readdir } from 'node:fs/promises';

const from = new URL('../packages/ui/src/skins/', import.meta.url);
const to = new URL('./public/skins/', import.meta.url);

await mkdir(to, { recursive: true });
for (const file of await readdir(from)) {
  await copyFile(new URL(file, from), new URL(file, to));
}
console.log('skins copied into docs/public');
