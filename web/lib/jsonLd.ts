import { urlForImage, type SanityImageRef } from '@/lib/sanity/image';

/*
 * schema.org structured data (plan Section 5.3). Builders return plain objects; render them
 * with components/JsonLd.tsx, which also escapes them for a <script> tag.
 */

/**
 * schema.org type of the organization. Narrow it per client - e.g. 'LegalService' for a law
 * firm, 'AccountingService', 'FinancialService', 'ProfessionalService' (CORPORATE_CLIENT_PLAN
 * Section 6).
 */
export const ORGANIZATION_TYPE = 'Organization';

export type JsonLdObject = Record<string, unknown>;

/** The Organization node's `@id`. The node is rendered by the root layout on every page,
 * so WebSite, Person and Article nodes can point at it on the same page. */
export function organizationId(origin: string): string {
  return `${origin}#organization`;
}

const CONTEXT = 'https://schema.org';
const LOGO_WIDTH = 512;

interface AddressValue {
  street?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  country?: string | null;
}

export interface OrganizationInput {
  name: string;
  legalName?: string | null;
  url: string;
  logo?: SanityImageRef | null;
  email?: string | null;
  phone?: string | null;
  address?: AddressValue | null;
  sameAs?: (string | null | undefined)[];
}

/** Drops undefined/null/empty values so the output only states what is known. */
function compact(object: JsonLdObject): JsonLdObject {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0),
    ),
  );
}

export function postalAddress(address: AddressValue | null | undefined): JsonLdObject | undefined {
  if (!address) return undefined;
  const value = compact({
    streetAddress: address.street,
    addressLocality: address.city,
    addressRegion: address.province,
    postalCode: address.postalCode,
    addressCountry: address.country,
  });
  return Object.keys(value).length > 0 ? { '@type': 'PostalAddress', ...value } : undefined;
}

export function organizationJsonLd(input: OrganizationInput): JsonLdObject {
  return compact({
    '@context': CONTEXT,
    '@type': ORGANIZATION_TYPE,
    '@id': organizationId(input.url),
    name: input.name,
    legalName: input.legalName,
    url: input.url,
    logo: input.logo?.asset ? urlForImage(input.logo).width(LOGO_WIDTH).url() : undefined,
    email: input.email,
    telephone: input.phone,
    address: postalAddress(input.address),
    sameAs: (input.sameAs ?? []).filter((url): url is string => Boolean(url)),
  });
}

export function websiteJsonLd(input: {
  name: string;
  url: string;
  language: string;
  organizationUrl: string;
}): JsonLdObject {
  return compact({
    '@context': CONTEXT,
    '@type': 'WebSite',
    name: input.name,
    url: input.url,
    inLanguage: input.language,
    publisher: { '@id': organizationId(input.organizationUrl) },
  });
}

/** `items` from the home page down to the current page, with absolute URLs. */
export function breadcrumbJsonLd(items: { name: string; url: string }[]): JsonLdObject {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function personJsonLd(input: {
  name: string;
  url: string;
  jobTitle?: string;
  email?: string | null;
  image?: SanityImageRef | null;
  sameAs?: (string | null | undefined)[];
  organizationUrl: string;
}): JsonLdObject {
  return compact({
    '@context': CONTEXT,
    '@type': 'Person',
    name: input.name,
    url: input.url,
    jobTitle: input.jobTitle,
    email: input.email,
    image: input.image?.asset ? urlForImage(input.image).width(LOGO_WIDTH).url() : undefined,
    sameAs: (input.sameAs ?? []).filter((url): url is string => Boolean(url)),
    worksFor: { '@id': organizationId(input.organizationUrl) },
  });
}

export function articleJsonLd(input: {
  headline: string;
  url: string;
  datePublished?: string | null;
  description?: string;
  language: string;
  authors: { name: string; url: string }[];
  organizationUrl: string;
}): JsonLdObject {
  return compact({
    '@context': CONTEXT,
    '@type': 'Article',
    headline: input.headline,
    url: input.url,
    mainEntityOfPage: input.url,
    datePublished: input.datePublished,
    description: input.description,
    inLanguage: input.language,
    author: input.authors.map((author) => ({
      '@type': 'Person',
      name: author.name,
      url: author.url,
    })),
    publisher: { '@id': organizationId(input.organizationUrl) },
  });
}

/**
 * JSON for a <script type="application/ld+json">. Escapes `<` as \u003c so content
 * can't close the tag - the escape the Next.js JSON-LD guide advises.
 */
export function serializeJsonLd(data: JsonLdObject | JsonLdObject[]): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
