import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;

/**
 * E2E smoke + accessibility suite (plan Section 5.1). Runs against a production build
 * (`npm run build` first) with the seed dataset from studio/seed/sample.ndjson imported -
 * tests/e2e/fixtures.ts lists the seed URLs it visits.
 */
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}/id`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
