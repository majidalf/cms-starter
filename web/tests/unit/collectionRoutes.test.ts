import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT ${url}`);
  }),
  notFound: vi.fn(() => {
    throw new Error('NOT_FOUND');
  }),
}));

const { detailPath, detailPaths, listPaths, redirectToLocalizedSlug, slugParams } =
  await import('@/lib/collectionRoutes');
const { routes } = await import('@/lib/routes');

const slug = { id: 'manajemen-risiko', en: 'risk-management' };

describe('detail and list paths', () => {
  it('builds a detail path per language', () => {
    expect(detailPath('en', '/services', slug)).toBe('/en/services/risk-management');
    expect(detailPath('id', '', slug)).toBe('/id/manajemen-risiko');
    expect(detailPath('en', '/services', { id: 'x' })).toBeUndefined();
  });

  it('builds hreflang paths for every language', () => {
    expect(detailPaths('/services', slug)).toEqual({
      id: '/id/services/manajemen-risiko',
      en: '/en/services/risk-management',
    });
    expect(listPaths('/insights')).toEqual({ id: '/id/insights', en: '/en/insights' });
  });
});

describe('slugParams', () => {
  it('returns the slugs of one language and skips documents without one', () => {
    const docs = [{ slug }, { slug: { id: 'hanya-id' } }, { slug: null }];
    expect(slugParams(docs, 'en')).toEqual([{ slug: 'risk-management' }]);
    expect(slugParams(docs, 'id')).toEqual([{ slug: 'manajemen-risiko' }, { slug: 'hanya-id' }]);
  });

  it('returns nothing for an unknown locale', () => {
    expect(slugParams([{ slug }], 'fr')).toEqual([]);
  });
});

describe('redirectToLocalizedSlug', () => {
  const find = vi.fn();
  beforeEach(() => find.mockReset());

  it("redirects a slug from the other language to this language's slug", async () => {
    find.mockResolvedValue({ slug });
    await expect(
      redirectToLocalizedSlug('en', 'manajemen-risiko', '/services', find),
    ).rejects.toThrow('REDIRECT /en/services/risk-management');
    expect(find).toHaveBeenCalledWith('manajemen-risiko');
  });

  it('404s when no document has the slug', async () => {
    find.mockResolvedValue(null);
    await expect(redirectToLocalizedSlug('en', 'nope', '/services', find)).rejects.toThrow(
      'NOT_FOUND',
    );
  });

  it('404s instead of redirecting to the same URL', async () => {
    find.mockResolvedValue({ slug });
    await expect(
      redirectToLocalizedSlug('en', 'risk-management', '/services', find),
    ).rejects.toThrow('NOT_FOUND');
  });

  it('404s when the document has no slug in this language', async () => {
    find.mockResolvedValue({ slug: { id: 'hanya-id' } });
    await expect(redirectToLocalizedSlug('en', 'hanya-id', '/services', find)).rejects.toThrow(
      'NOT_FOUND',
    );
  });
});

describe('routes', () => {
  // lib/routes.ts and the folders in app/[locale]/ must agree (see the comment in routes.ts).
  it.each(Object.entries(routes))('%s (%s) has a page in app/[locale]', (_name, route) => {
    const page = path.join(import.meta.dirname, '../../app/[locale]', route, 'page.tsx');
    expect(fs.existsSync(page), page).toBe(true);
  });
});
