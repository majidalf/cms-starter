import { defineConfig } from 'vitest/config';

/**
 * Unit tests for lib/** (plan Section 5.1). Pages and components are covered by the E2E and
 * accessibility suite in tests/e2e/ instead of snapshots.
 */
export default defineConfig({
  resolve: {
    alias: { '@': import.meta.dirname },
  },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
    // lib/sanity/client.ts and lib/site.ts read these at import time. Fixed values keep the
    // tests independent of .env.local; no test talks to Sanity (the client is mocked).
    env: {
      NEXT_PUBLIC_SANITY_PROJECT_ID: 'test-project',
      NEXT_PUBLIC_SANITY_DATASET: 'production',
      NEXT_PUBLIC_SITE_URL: 'https://www.example.com',
    },
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: ['lib/**/*.ts'],
      reporter: ['text-summary', 'text', 'html'],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
});
