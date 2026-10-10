import { DEFAULT_LANG, expect, PAGES, test } from './fixtures';

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
    expect(hreflang).toEqual({ id: pair.id, en: pair.en, 'x-default': pair[DEFAULT_LANG] });
  });
}

test('the language switcher opens the same content in the other language', async ({ page }) => {
  // The switch sits in the top bar on desktop and in the menu on phones.
  await page.goto('/id/practice-areas/hukum-korporasi-komersial');
  const menuButton = page.getByRole('button', { name: 'Buka menu' });
  if (await menuButton.isVisible()) await menuButton.click();
  await page.getByRole('navigation', { name: 'Bahasa' }).getByRole('link', { name: 'en' }).click();
  await expect(page).toHaveURL(/\/en\/practice-areas\/corporate-commercial-law$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toHaveText('Corporate & Commercial Law');
});

test('/ redirects to the default language', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/en$/);
});

test.describe('404s on purpose', () => {
  test.use({ allowNotFound: true });

  test('an unknown slug shows the site 404 in the language of the URL', async ({ page }) => {
    const response = await page.goto('/en/practice-areas/does-not-exist');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'This page does not exist.' })).toBeVisible();
    await page.goto('/id/practice-areas/tidak-ada');
    await expect(page.getByRole('heading', { name: 'Halaman ini tidak ada.' })).toBeVisible();
  });

  test('removed routes stay gone', async ({ page }) => {
    // Sectors are names only, and this client has no careers pages.
    expect((await page.goto('/en/sectors/financial-services'))?.status()).toBe(404);
    expect((await page.goto('/en/careers'))?.status()).toBe(404);
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
  await page.goto('/en/partners/zico-fernando');
  const link = page.getByRole('link', { name: 'Save contact (vCard)' });
  const response = await page.request.get((await link.getAttribute('href')) ?? '');
  expect(response.headers()['content-type']).toContain('text/vcard');
  expect(await response.text()).toContain('FN:Zico Fernando');
});

test('the practice index is a tab list on desktop and an accordion on phones', async ({
  page,
  isMobile,
}) => {
  await page.goto('/en');
  if (isMobile) {
    const button = page.getByRole('button', { name: /Mergers & Acquisitions/ });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    // One area open at a time.
    await expect(page.getByRole('button', { name: /Corporate & Commercial Law/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    return;
  }
  const tab = page.getByRole('tab', { name: /Mergers & Acquisitions/ });
  await tab.click();
  await expect(tab).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel').getByRole('heading')).toHaveText(
    'Mergers & Acquisitions',
  );
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('tabpanel').getByRole('heading')).toHaveText(
    'Investment & Business Structuring',
  );
});

test('the contact form names each field that needs fixing', async ({ page }) => {
  await page.goto('/en/contact');
  await page.getByLabel('Email').fill('name@company');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByText('Enter your full name.')).toBeVisible();
  await expect(
    page.getByText('Enter a full email address, such as name@company.com.'),
  ).toBeVisible();
  await expect(page.getByText('Tick the box to agree before sending.')).toBeVisible();
  await expect(page.getByLabel('Full name')).toBeFocused();
});

test('the mobile menu takes focus and closes on Escape', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'the menu button only exists on phones');
  await page.goto('/en/about');
  const open = page.getByRole('button', { name: 'Open menu' });
  await open.click();
  await expect(page.getByRole('button', { name: 'Close menu' })).toBeFocused();
  await expect(page.getByRole('dialog').getByRole('link', { name: 'About' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(open).toBeFocused();
});
