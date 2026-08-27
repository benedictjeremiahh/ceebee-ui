import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: 'http://localhost:4100',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm --filter @ceebee/docs dev',
    url: 'http://localhost:4100',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
