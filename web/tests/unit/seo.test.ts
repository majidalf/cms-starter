import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildMetadata } from '@/lib/seo';

const paths = { id: '/id/layanan', en: '/en/services' };

describe('buildMetadata', () => {
  it('prefers SEO fields, then the document, then site defaults', () => {
    const meta = buildMetadata({
      locale: 'en',
      title: 'Services',
      description: 'Own summary',
      seo: { metaTitle: { en: 'SEO title' }, metaDescription: { en: 'SEO description' } },
      defaults: { metaDescription: { en: 'Default description' } },
      paths,
    });
    expect(meta.title).toBe('SEO title');
    expect(meta.description).toBe('SEO description');
  });

  it('falls back to the document title and summary, then the site default', () => {
    const own = buildMetadata({ locale: 'en', title: 'Services', description: 'Own', paths });
    expect(own).toMatchObject({ title: 'Services', description: 'Own' });

    const fallback = buildMetadata({
      locale: 'id',
      defaults: { metaDescription: { id: 'Bawaan' } },
      paths,
    });
    expect(fallback.description).toBe('Bawaan');
    // No title at all: left out so the layout's default title applies.
    expect('title' in fallback).toBe(false);
  });

  it('lists every language plus x-default (the default language) as alternates', () => {
    const meta = buildMetadata({ locale: 'en', title: 'X', paths });
    expect(meta.alternates).toEqual({
      canonical: '/en/services',
      languages: { id: '/id/layanan', en: '/en/services', 'x-default': '/id/layanan' },
    });
  });

  it('leaves out a language without a path, and x-default with it', () => {
    const meta = buildMetadata({ locale: 'en', title: 'X', paths: { en: '/en/only' } });
    expect(meta.alternates?.languages).toEqual({ en: '/en/only' });
  });

  it('uses the per-language canonical URL when set', () => {
    const meta = buildMetadata({
      locale: 'id',
      paths,
      seo: { canonicalUrl: { id: 'https://source.example/a' } },
    });
    expect(meta.alternates?.canonical).toBe('https://source.example/a');
  });

  it('honours "Hide from search engines"', () => {
    expect(buildMetadata({ locale: 'id', paths }).robots).toBeUndefined();
    expect(buildMetadata({ locale: 'id', paths, seo: { noIndex: true } }).robots).toEqual({
      index: false,
      follow: false,
    });
  });

  it('builds a 1200x630 Open Graph image from the page or the defaults', () => {
    const image = { asset: { _ref: 'image-abc123-2400x1600-jpg' } };
    const meta = buildMetadata({ locale: 'en', paths, defaults: { ogImage: image } });
    const og = meta.openGraph as { images: { url: string; width: number }[]; locale: string };
    expect(og.locale).toBe('en_US');
    expect(og.images[0]).toMatchObject({ width: 1200, height: 630 });
    expect(og.images[0].url).toContain('cdn.sanity.io/images/test-project/production/abc123');
    expect(og.images[0].url).toContain('w=1200');
  });
});

describe('indexing outside production', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('marks every page noindex when the dataset is not production', async () => {
    vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', 'staging');
    vi.resetModules();
    const seo = await import('@/lib/seo');
    expect(seo.isIndexable).toBe(false);
    expect(seo.buildMetadata({ locale: 'id', paths }).robots).toEqual({
      index: false,
      follow: false,
    });
  });
});
