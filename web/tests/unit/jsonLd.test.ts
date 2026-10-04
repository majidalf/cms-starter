import { describe, expect, it } from 'vitest';
import {
  articleJsonLd,
  breadcrumbJsonLd,
  ORGANIZATION_TYPE,
  organizationJsonLd,
  personJsonLd,
  postalAddress,
  serializeJsonLd,
  websiteJsonLd,
} from '@/lib/jsonLd';

const url = 'https://www.example.com';

describe('organizationJsonLd', () => {
  it('states the known fields and links the logo to the Sanity CDN', () => {
    const data = organizationJsonLd({
      name: 'Contoh',
      legalName: 'PT Contoh',
      url,
      logo: { asset: { _ref: 'image-logo1-800x200-png' } },
      email: 'info@example.com',
      phone: '+62 21 0000',
      address: { street: 'Jl. Contoh 1', city: 'Jakarta', country: 'Indonesia' },
      sameAs: ['https://www.linkedin.com/x', null, undefined],
    });
    expect(data).toMatchObject({
      '@context': 'https://schema.org',
      '@type': ORGANIZATION_TYPE,
      '@id': `${url}#organization`,
      legalName: 'PT Contoh',
      telephone: '+62 21 0000',
      sameAs: ['https://www.linkedin.com/x'],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jl. Contoh 1',
        addressLocality: 'Jakarta',
      },
    });
    expect(data.logo).toContain('logo1');
  });

  it('leaves out unknown fields instead of emitting nulls', () => {
    const data = organizationJsonLd({ name: 'Contoh', url, legalName: null, sameAs: [] });
    expect(Object.keys(data).toSorted()).toEqual(['@context', '@id', '@type', 'name', 'url']);
  });
});

describe('postalAddress', () => {
  it('is undefined for an empty or missing address', () => {
    expect(postalAddress(null)).toBeUndefined();
    expect(postalAddress({ city: '' })).toBeUndefined();
  });
});

describe('other builders', () => {
  it('websiteJsonLd, personJsonLd and articleJsonLd point at the Organization @id', () => {
    const organization = organizationJsonLd({ name: 'Contoh', url });
    const website = websiteJsonLd({
      name: 'Contoh',
      url: `${url}/id`,
      language: 'id',
      organizationUrl: url,
    });
    expect(website).toMatchObject({ '@type': 'WebSite', inLanguage: 'id' });
    expect(website.publisher).toEqual({ '@id': organization['@id'] });
    const person = personJsonLd({ name: 'A', url, organizationUrl: url });
    expect(person.worksFor).toEqual({ '@id': organization['@id'] });
    const article = articleJsonLd({
      headline: 'A',
      url,
      language: 'en',
      authors: [],
      organizationUrl: url,
    });
    expect(article.publisher).toEqual({ '@id': organization['@id'] });
  });

  it('breadcrumbJsonLd numbers items from 1', () => {
    const data = breadcrumbJsonLd([
      { name: 'Home', url: `${url}/en` },
      { name: 'Services', url: `${url}/en/services` },
    ]);
    expect(data.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${url}/en` },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${url}/en/services` },
    ]);
  });

  it('personJsonLd works for the organization and skips a missing photo', () => {
    const data = personJsonLd({
      name: 'Ratna',
      url: `${url}/en/about/leadership/ratna`,
      jobTitle: 'Director',
      organizationUrl: url,
      image: null,
      sameAs: [undefined],
    });
    expect(data).toMatchObject({ '@type': 'Person', worksFor: { '@id': `${url}#organization` } });
    expect('image' in data).toBe(false);
    expect('sameAs' in data).toBe(false);
  });

  it('personJsonLd includes the photo when there is one', () => {
    const data = personJsonLd({
      name: 'Ratna',
      url,
      organizationUrl: url,
      image: { asset: { _ref: 'image-photo1-800x1000-jpg' } },
    });
    expect(data.image).toContain('photo1');
  });

  it('articleJsonLd lists the authors', () => {
    const data = articleJsonLd({
      headline: 'Title',
      url: `${url}/en/insights/a`,
      datePublished: '2026-08-20',
      language: 'en',
      authors: [{ name: 'Sari', url: `${url}/en/about/leadership/sari` }],
      organizationUrl: url,
    });
    expect(data).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-20',
      author: [{ '@type': 'Person', name: 'Sari' }],
    });
  });
});

describe('serializeJsonLd', () => {
  it('cannot be used to close the script tag', () => {
    const json = serializeJsonLd({ name: '</script><script>alert(1)</script>' });
    expect(json).not.toContain('<');
    const escapedLessThan = `${String.fromCharCode(92)}u003c`;
    expect(json).toContain(`${escapedLessThan}/script>`);
    // Still valid JSON that decodes back to the original text.
    expect(JSON.parse(json).name).toBe('</script><script>alert(1)</script>');
  });
});
