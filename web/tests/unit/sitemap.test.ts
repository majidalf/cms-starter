import { describe, expect, it } from 'vitest';
import { routes } from '@/lib/routes';
import { buildSitemap, SITEMAP_ROUTES, type SitemapData } from '@/lib/sitemap';

const siteUrl = new URL('https://www.example.com');
const urls = (data: SitemapData) => buildSitemap(data, siteUrl).map((entry) => entry.url);

const empty: SitemapData = { home: null, documents: [] };

describe('buildSitemap', () => {
  it('lists every preset list page in both languages', () => {
    const list = urls(empty);
    for (const route of Object.values(routes)) {
      expect(list).toContain(`https://www.example.com/id${route}`);
      expect(list).toContain(`https://www.example.com/en${route}`);
    }
    expect(list).toHaveLength(Object.values(routes).length * 2);
  });

  it('adds the home page unless it is hidden from search engines', () => {
    const shown = urls({
      home: { _updatedAt: '2026-01-01T00:00:00Z', noIndex: null },
      documents: [],
    });
    expect(shown).toContain('https://www.example.com/id');
    expect(shown).toContain('https://www.example.com/en');
    const hidden = urls({
      home: { _updatedAt: '2026-01-01T00:00:00Z', noIndex: true },
      documents: [],
    });
    expect(hidden).not.toContain('https://www.example.com/id');
  });

  it('adds each document under its route, with lastModified and all alternates', () => {
    const entries = buildSitemap(
      {
        home: null,
        documents: [
          {
            _type: 'service',
            slug: { id: 'manajemen-risiko', en: 'risk-management' },
            _updatedAt: '2026-05-01T10:00:00Z',
          },
        ],
      },
      siteUrl,
    );
    const entry = entries.find(
      (e) => e.url === 'https://www.example.com/en/practice-areas/risk-management',
    );
    expect(entry).toEqual({
      url: 'https://www.example.com/en/practice-areas/risk-management',
      lastModified: '2026-05-01T10:00:00Z',
      alternates: {
        languages: {
          id: 'https://www.example.com/id/practice-areas/manajemen-risiko',
          en: 'https://www.example.com/en/practice-areas/risk-management',
          'x-default': 'https://www.example.com/en/practice-areas/risk-management',
        },
      },
    });
  });

  it('maps top-level pages to the root and every preset type to its route', () => {
    expect(SITEMAP_ROUTES.page).toBe('');
    const list = urls({
      home: null,
      documents: [{ _type: 'page', slug: { id: 'tentang', en: 'about' }, _updatedAt: 'x' }],
    });
    expect(list).toContain('https://www.example.com/id/tentang');
    expect(
      Object.values(SITEMAP_ROUTES)
        .filter(Boolean)
        .every((r) => Object.values(routes).includes(r as never)),
    ).toBe(true);
  });

  it('skips unknown types and missing language versions', () => {
    const list = urls({
      home: null,
      documents: [
        { _type: 'siteSettings', slug: { id: 'x', en: 'x' }, _updatedAt: 'x' },
        { _type: 'insight', slug: { id: 'hanya-id' }, _updatedAt: 'x' },
      ],
    });
    expect(list.some((url) => url.includes('/x'))).toBe(false);
    expect(list).toContain('https://www.example.com/id/insights/hanya-id');
    expect(list.filter((url) => url.includes('hanya-id'))).toHaveLength(1);
  });
});
