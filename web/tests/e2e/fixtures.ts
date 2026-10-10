import { test as base, expect } from '@playwright/test';

/**
 * Seed URLs (studio/seed/harianja/harianja.ndjson): the same content in Indonesian and
 * English. Replace this list when the seed content changes.
 */
export const PAGE_PAIRS: { name: string; id: string; en: string }[] = [
  { name: 'home', id: '/id', en: '/en' },
  { name: 'about', id: '/id/about', en: '/en/about' },
  { name: 'legal page', id: '/id/penafian', en: '/en/disclaimer' },
  { name: 'partners', id: '/id/partners', en: '/en/partners' },
  { name: 'profile', id: '/id/partners/zico-fernando', en: '/en/partners/zico-fernando' },
  { name: 'practice areas', id: '/id/practice-areas', en: '/en/practice-areas' },
  {
    name: 'practice area',
    id: '/id/practice-areas/hukum-korporasi-komersial',
    en: '/en/practice-areas/corporate-commercial-law',
  },
  { name: 'sectors', id: '/id/sectors', en: '/en/sectors' },
  { name: 'experience', id: '/id/experience', en: '/en/experience' },
  {
    name: 'matter',
    id: '/id/experience/pemasok-piutang-dagang-belum-dibayar',
    en: '/en/experience/supplier-unpaid-trade-receivable',
  },
  { name: 'insights', id: '/id/insights', en: '/en/insights' },
  {
    name: 'insight',
    id: '/id/insights/menyiapkan-tagihan-utang-sebelum-mengirim-somasi',
    en: '/en/insights/preparing-a-debt-claim-before-sending-a-demand-letter',
  },
  { name: 'contact', id: '/id/contact', en: '/en/contact' },
];

/** hreflang `x-default` points at the default language (English, decision D-14). */
export const DEFAULT_LANG = 'en' as const;

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
