import { test as base, expect } from '@playwright/test';

/**
 * Seed URLs (studio/seed/sample.ndjson): the same content in Indonesian and English. A
 * project replacing the seed with real content updates this list.
 */
export const PAGE_PAIRS: { name: string; id: string; en: string }[] = [
  { name: 'home', id: '/id', en: '/en' },
  { name: 'generic page', id: '/id/tentang-kami', en: '/en/about-us' },
  { name: 'leadership', id: '/id/about/leadership', en: '/en/about/leadership' },
  {
    name: 'profile',
    id: '/id/about/leadership/ratna-wulandari',
    en: '/en/about/leadership/ratna-wulandari',
  },
  { name: 'services', id: '/id/services', en: '/en/services' },
  { name: 'service', id: '/id/services/manajemen-risiko', en: '/en/services/risk-management' },
  { name: 'industries', id: '/id/industries', en: '/en/industries' },
  { name: 'industry', id: '/id/industries/jasa-keuangan', en: '/en/industries/financial-services' },
  { name: 'case studies', id: '/id/case-studies', en: '/en/case-studies' },
  {
    name: 'case study',
    id: '/id/case-studies/kerangka-risiko-bank-daerah',
    en: '/en/case-studies/regional-bank-risk-framework',
  },
  { name: 'insights', id: '/id/insights', en: '/en/insights' },
  {
    name: 'insight',
    id: '/id/insights/pernyataan-selera-risiko',
    en: '/en/insights/risk-appetite-statement',
  },
  { name: 'careers', id: '/id/careers', en: '/en/careers' },
  {
    name: 'job opening',
    id: '/id/careers/konsultan-manajemen-risiko',
    en: '/en/careers/risk-management-consultant',
  },
  { name: 'contact', id: '/id/contact', en: '/en/contact' },
];

/** Every page: label, path, language and the id/en pair it belongs to. */
export const PAGES = PAGE_PAIRS.flatMap((pair) => [
  { label: `${pair.name} (id)`, path: pair.id, lang: 'id', pair },
  { label: `${pair.name} (en)`, path: pair.en, lang: 'en', pair },
]);

const NOT_FOUND_MESSAGE = 'the server responded with a status of 404';

/**
 * `test` that fails on any browser console error or uncaught page error - this is also how
 * a Content-Security-Policy violation shows up. Tests that open a 404 on purpose set
 * `test.use({ allowNotFound: true })`: the browser logs the 404 document load as an error.
 */
export const test = base.extend<{ allowNotFound: boolean; consoleErrors: string[] }>({
  allowNotFound: [false, { option: true }],
  consoleErrors: [
    async ({ page, allowNotFound }, use) => {
      const errors: string[] = [];
      page.on('console', (message) => {
        if (message.type() !== 'error') return;
        if (allowNotFound && message.text().includes(NOT_FOUND_MESSAGE)) return;
        errors.push(message.text());
      });
      page.on('pageerror', (error) => errors.push(error.message));
      await use(errors);
      expect(errors, 'browser console errors').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
