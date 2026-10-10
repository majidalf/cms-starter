import { AxeBuilder } from '@axe-core/playwright';
import { expect, PAGES, test } from './fixtures';

/** Plan Section 5.1: no serious or critical axe violations (WCAG 2.x A/AA rules). */
const BLOCKING = new Set(['serious', 'critical']);

async function blockingViolations(page: import('@playwright/test').Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  return results.violations
    .filter((violation) => BLOCKING.has(violation.impact ?? ''))
    .map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      targets: violation.nodes.map((node) => node.target.join(' ')).slice(0, 5),
    }));
}

for (const { label, path } of PAGES) {
  test(`${label} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    expect(await blockingViolations(page)).toEqual([]);
  });
}

test.describe('404 page', () => {
  test.use({ allowNotFound: true });

  test('the 404 page has no serious accessibility violations', async ({ page }) => {
    await page.goto('/id/tidak-ada-halaman');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await blockingViolations(page)).toEqual([]);
  });
});
