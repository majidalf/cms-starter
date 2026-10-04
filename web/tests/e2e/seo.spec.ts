import { expect, PAGE_PAIRS, PAGES, test } from './fixtures';

/* T3 features end to end: response headers, robots.txt, sitemap.xml and structured data. */

const SECURITY_HEADERS = [
  'content-security-policy',
  'strict-transport-security',
  'x-content-type-options',
  'x-frame-options',
  'referrer-policy',
  'permissions-policy',
];

/** URLs from the seed that must never be public (CORPORATE_CLIENT_PLAN Section 5.1). */
const HIDDEN_PATHS = [
  '/id/case-studies/tata-kelola-perusahaan-energi',
  '/en/case-studies/energy-company-governance',
  '/id/careers/manajer-kepatuhan',
  '/en/careers/compliance-manager',
];

test.describe('response headers', () => {
  for (const path of ['/id', '/en/services/risk-management', '/sitemap.xml', '/robots.txt']) {
    test(`security headers on ${path}`, async ({ request }) => {
      const response = await request.get(path);
      expect(response.status()).toBe(200);
      for (const header of SECURITY_HEADERS)
        expect(response.headers()[header], header).toBeTruthy();
      expect(response.headers()['content-security-policy']).not.toContain('unsafe-eval');
    });
  }

  test('*.workers.dev hosts are kept out of search results', async ({ request }) => {
    const preview = await request.get('/id', { headers: { host: 'site.example.workers.dev' } });
    expect(preview.headers()['x-robots-tag']).toBe('noindex, nofollow');
    expect((await request.get('/id')).headers()['x-robots-tag']).toBeUndefined();
  });
});

test('robots.txt is served', async ({ request }) => {
  const response = await request.get('/robots.txt');
  expect(response.status()).toBe(200);
  expect(await response.text()).toMatch(/User-Agent: \*/i);
});

/** loc pathname -> alternates (hreflang -> pathname) */
async function readSitemap(request: import('@playwright/test').APIRequestContext) {
  const xml = await (await request.get('/sitemap.xml')).text();
  const entries = new Map<string, Record<string, string>>();
  for (const [, block] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!loc) continue;
    const alternates = Object.fromEntries(
      [...block.matchAll(/hreflang="([^"]+)"\s+href="([^"]+)"/g)].map(([, lang, href]) => [
        lang,
        new URL(href).pathname,
      ]),
    );
    entries.set(new URL(loc).pathname, alternates);
  }
  return entries;
}

test.describe('sitemap.xml', () => {
  test('lists every page with the same alternates as its hreflang', async ({ request }) => {
    const sitemap = await readSitemap(request);
    for (const { path, pair } of PAGES) {
      expect(sitemap.get(path), path).toEqual({ id: pair.id, en: pair.en, 'x-default': pair.id });
    }
  });

  test('leaves out hidden documents', async ({ request }) => {
    const sitemap = await readSitemap(request);
    for (const path of HIDDEN_PATHS) expect(sitemap.has(path), path).toBe(false);
  });

  test('only lists URLs that load', async ({ request }) => {
    const paths = [...(await readSitemap(request)).keys()];
    expect(paths.length).toBeGreaterThanOrEqual(PAGE_PAIRS.length * 2);
    const statuses = await Promise.all(
      paths.map(async (path) => [path, (await request.get(path)).status()]),
    );
    expect(statuses.filter(([, status]) => status !== 200)).toEqual([]);
  });
});

test.describe('structured data', () => {
  for (const { label, path } of PAGES) {
    test(`${label}: JSON-LD parses and every @id reference resolves`, async ({ page }) => {
      await page.goto(path);
      const blocks = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((scripts) => scripts.map((script) => script.textContent ?? ''));
      const nodes = blocks.flatMap((block) => {
        const data: unknown = JSON.parse(block);
        return Array.isArray(data) ? data : [data];
      }) as Record<string, unknown>[];

      const types = nodes.map((node) => node['@type']);
      expect(types).toContain('Organization');

      const defined = new Set(nodes.map((node) => node['@id']).filter(Boolean));
      const references: string[] = [];
      const collect = (value: unknown) => {
        if (Array.isArray(value)) value.forEach(collect);
        else if (value && typeof value === 'object') {
          const object = value as Record<string, unknown>;
          if (Object.keys(object).length === 1 && typeof object['@id'] === 'string') {
            references.push(object['@id']);
          }
          Object.values(object).forEach(collect);
        }
      };
      nodes.forEach((node) => Object.values(node).forEach(collect));
      for (const reference of references) expect(defined.has(reference), reference).toBe(true);
    });
  }
});
