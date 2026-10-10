import { defineConfig, devices } from '@playwright/test';

// Also hard-coded in package.json (cf:preview:serve) and lighthouserc.json.
const PORT = 3100;

/**
 * E2E smoke + accessibility suite (plan Section 5.1), with the seed dataset from
 * studio/seed/harianja/harianja.ndjson imported - tests/e2e/fixtures.ts lists the seed URLs
 * it visits.
 *
 * Default server: `next start` (run `npm run build` first) - quick for local work.
 * E2E_SERVER=worker serves the OpenNext Worker in workerd instead (`npm run cf:build`
 * first). CI always uses the Worker: it is what production runs, and it has behaviour
 * `next start` doesn't (see components/layout/LanguageSwitcher.tsx).
 * E2E_BASE_URL runs the suite against a server that is already up instead (e.g. `next dev`
 * reading the seed through scripts/mock-sanity.mjs) and starts nothing.
 */
const SERVER_COMMANDS = {
  next: `npm run start -- -p ${PORT}`,
  worker: 'npm run cf:preview:serve',
} as const;
const server = process.env.E2E_SERVER === 'worker' ? 'worker' : 'next';
const externalBaseUrl = process.env.E2E_BASE_URL;
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: externalBaseUrl ?? `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: externalBaseUrl
    ? undefined
    : {
        command: SERVER_COMMANDS[server],
        url: `http://localhost:${PORT}/id`,
        reuseExistingServer: !process.env.CI,
        // The Worker preview first loads the build's cache into local R2.
        timeout: 180_000,
      },
});
