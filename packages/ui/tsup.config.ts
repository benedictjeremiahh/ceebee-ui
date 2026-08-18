import { defineConfig } from 'tsup';

// Two builds, not two entries of one build: the server entry must never inherit the
// "use client" banner, and a shared chunk between them would carry the directive across
// the boundary ADR 0004 draws.
export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    clean: true,
    treeshake: true,
    external: ['react', 'react-dom'],
  },
  {
    entry: ['src/client.ts'],
    format: ['esm'],
    dts: true,
    clean: false,
    treeshake: true,
    banner: { js: '"use client";' },
    external: ['react', 'react-dom', 'motion', '@base-ui/react', 'lucide-react'],
  },
]);
