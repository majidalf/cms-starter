import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/sanity/queries', () => ({
  getSiteSettings: vi.fn().mockResolvedValue({
    defaultSeo: { metaDescription: { id: 'Bawaan', en: 'Default' } },
  }),
}));

const { detailPageMetadata, listPageMetadata } = await import('@/lib/pageMetadata');
const { absoluteUrl } = await import('@/lib/site');

describe('listPageMetadata', () => {
  it('uses the dictionary title, the site default description and both language paths', async () => {
    const meta = await listPageMetadata(
      Promise.resolve({ locale: 'en' }),
      '/services',
      (t) => t.services,
    );
    expect(meta).toMatchObject({
      title: 'Services',
      description: 'Default',
      alternates: {
        canonical: '/en/services',
        languages: { id: '/id/services', en: '/en/services' },
      },
    });
  });

  it('returns nothing for an unknown locale', async () => {
    expect(
      await listPageMetadata(Promise.resolve({ locale: 'fr' }), '/x', (t) => t.services),
    ).toEqual({});
  });
});

describe('detailPageMetadata', () => {
  it('returns nothing when the slug matched no document', async () => {
    expect(await detailPageMetadata('id', '/services', null)).toEqual({});
  });

  it("uses the document's title, summary and per-language slugs", async () => {
    const meta = await detailPageMetadata('id', '/services', {
      slug: { id: 'manajemen-risiko', en: 'risk-management' },
      seo: null,
      title: 'Manajemen Risiko',
      description: 'Ringkasan',
    });
    expect(meta).toMatchObject({
      title: 'Manajemen Risiko',
      description: 'Ringkasan',
      alternates: { canonical: '/id/services/manajemen-risiko' },
    });
  });
});

describe('absoluteUrl', () => {
  it('resolves a path against NEXT_PUBLIC_SITE_URL', () => {
    expect(absoluteUrl('/en/services')).toBe('https://www.example.com/en/services');
  });
});
