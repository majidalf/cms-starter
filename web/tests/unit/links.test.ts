import { describe, expect, it } from 'vitest';
import { resolveLink, resolveLinks, safeHref, telHref, type LinkValue } from '@/lib/links';
import { localize, localizeSlug } from '@/lib/sanity/localize';

describe('safeHref', () => {
  it.each(['https://example.com', 'http://example.com', 'mailto:a@b.c', 'tel:+6221', '/id/about'])(
    'allows %s',
    (href) => {
      expect(safeHref(href)).toBe(href);
    },
  );

  it.each([
    'javascript:alert(1)',
    'JavaScript:alert(1)',
    'data:text/html,hi',
    'vbscript:x',
    '//evil.example',
    'example.com',
    '',
  ])('rejects %s', (href) => {
    expect(safeHref(href)).toBeUndefined();
  });

  it('rejects null and undefined', () => {
    expect(safeHref(null)).toBeUndefined();
    expect(safeHref(undefined)).toBeUndefined();
  });

  it('is case-insensitive for allowed schemes', () => {
    expect(safeHref('HTTPS://EXAMPLE.COM')).toBe('HTTPS://EXAMPLE.COM');
  });
});

describe('telHref', () => {
  it('keeps only digits and the leading plus', () => {
    expect(telHref('+62 21 (0000) 0000')).toBe('tel:+622100000000');
  });
});

describe('localize / localizeSlug', () => {
  it('picks the requested language without falling back', () => {
    expect(localize({ id: 'Halo', en: 'Hello' }, 'en')).toBe('Hello');
    expect(localize({ id: 'Halo' }, 'en')).toBeUndefined();
    expect(localize({ id: 'Halo', en: null }, 'en')).toBeUndefined();
    expect(localize(null, 'id')).toBeUndefined();
  });

  it('treats an empty slug as missing', () => {
    expect(localizeSlug({ id: '', en: 'about' }, 'id')).toBeUndefined();
    expect(localizeSlug({ id: 'tentang', en: 'about' }, 'id')).toBe('tentang');
  });
});

describe('resolveLink', () => {
  const label = { id: 'Layanan', en: 'Services' };

  it('prefixes a site path with the language', () => {
    expect(resolveLink({ _key: 'a', label, linkType: 'path', path: '/services' }, 'en')).toEqual({
      key: 'a',
      label: 'Services',
      href: '/en/services',
      isExternal: false,
    });
  });

  it('follows a page link to its slug in the language', () => {
    const link: LinkValue = { label, linkType: 'page', pageSlug: { id: 'layanan', en: 'svc' } };
    expect(resolveLink(link, 'id')?.href).toBe('/id/layanan');
    expect(resolveLink(link, 'en')?.key).toBe('/en/svc');
  });

  it('sends a link to the home page to the language root', () => {
    expect(resolveLink({ label, linkType: 'page', isHomePage: true }, 'en')?.href).toBe('/en');
  });

  it('keeps external URLs as-is and marks them external', () => {
    const link = resolveLink({ label, linkType: 'external', url: 'https://x.test' }, 'id');
    expect(link).toMatchObject({ href: 'https://x.test', isExternal: true });
  });

  it('skips links that cannot be resolved', () => {
    expect(resolveLink({ label: { id: 'X' }, linkType: 'path', path: '/x' }, 'en')).toBeUndefined();
    expect(resolveLink({ label, linkType: 'page', pageSlug: null }, 'en')).toBeUndefined();
    expect(resolveLink({ label, linkType: 'external', url: 'javascript:x' }, 'en')).toBeUndefined();
    expect(resolveLink({ label, linkType: 'path', path: null }, 'en')).toBeUndefined();
  });

  it('resolveLinks drops the unresolvable ones and accepts null', () => {
    const links: LinkValue[] = [
      { label, linkType: 'path', path: '/a' },
      { label, linkType: 'external', url: 'data:x' },
    ];
    expect(resolveLinks(links, 'id').map((link) => link.href)).toEqual(['/id/a']);
    expect(resolveLinks(null, 'id')).toEqual([]);
  });
});
