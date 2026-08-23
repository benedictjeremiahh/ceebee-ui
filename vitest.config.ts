import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['packages/**/*.spec.{ts,tsx}', 'docs/**/*.spec.{ts,tsx}'],
  },
});
