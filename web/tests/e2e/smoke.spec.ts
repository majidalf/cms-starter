import { expect, PAGES, test } from './fixtures';

for (const { label, path, lang, pair } of PAGES) {
  test(`${label} renders with SEO basics`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);

    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page).toHaveTitle(/\S/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S/);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();

    const alternates = page.locator('link[rel="alternate"][hreflang]');
    const hreflang = Object.fromEntries(
      await alternates.evaluateAll((links) =>
        links.map((link) => [
          link.getAttribute('hreflang'),
          new URL(link.getAttribute('href') ?? '').pathname,
        ]),
      ),
    );
    expect(hreflang).toEqual({ id: pair.id, en: pair.en, 'x-default': pair.id });
  });
}

test('the language switcher opens the same content in the other language', async ({ page }) => {
  await page.goto('/id/services/manajemen-risiko');
  await page
    .getByRole('navigation', { name: 'Pilih bahasa' })
    .getByRole('link', { name: 'en' })
    .click();
  await expect(page).toHaveURL(/\/en\/services\/risk-management$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toHaveText('Risk Management');
});

test('/ redirects to the default language', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/id$/);
});

test.describe('404s on purpose', () => {
  test.use({ allowNotFound: true });

  test('an unknown slug shows the site 404 in both languages', async ({ page }) => {
    const response = await page.goto('/en/services/does-not-exist');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Halaman tidak ditemukan' })).toBeVisible();
  });

  test('hidden documents never show up', async ({ page }) => {
    await page.goto('/en/case-studies');
    await expect(page.getByText('Restructuring governance')).toHaveCount(0);
    expect((await page.goto('/en/case-studies/energy-company-governance'))?.status()).toBe(404);
    expect((await page.goto('/en/careers/compliance-manager'))?.status()).toBe(404);
    await page.goto('/en/about-us');
    await expect(page.getByText('Best Consultancy Award')).toHaveCount(0);
    await expect(page.getByText('ISO 9001:2015 Quality Management System')).toBeVisible();
  });
});

test('the skip link is the first stop for keyboard users', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard navigation is a desktop concern');
  await page.goto('/en');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});

test('a profile offers a vCard download', async ({ page, isMobile }) => {
  test.skip(isMobile, 'same markup as desktop');
  await page.goto('/en/about/leadership/ratna-wulandari');
  const link = page.getByRole('link', { name: 'Save contact (vCard)' });
  const response = await page.request.get((await link.getAttribute('href')) ?? '');
  expect(response.headers()['content-type']).toContain('text/vcard');
  expect(await response.text()).toContain('FN:Ratna Wulandari');
});
