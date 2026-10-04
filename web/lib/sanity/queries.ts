import { cache } from 'react';
import { defineQuery } from 'groq';
import { sanityClient } from './client';

// Queries return every language; components pick one with localize(). Result types are
// generated into sanity.types.ts by `npm run typegen` in studio/ - rerun it after changing
// a query or the schema.

const HOME_PAGE_REF = `*[_id == "siteSettings"][0].homePage._ref`;

const LINK_FIELDS = `
  _key, label, linkType, path, url,
  "pageSlug": page->slug,
  "isHomePage": defined(page._ref) && page._ref == ${HOME_PAGE_REF}
`;

const PAGE_FIELDS = `
  _id, title, slug, seo,
  sections[]{
    ...,
    _type == "heroSection" => { "ctas": ctas[]{ ${LINK_FIELDS} } },
    _type == "ctaSection" => { "cta": cta{ ${LINK_FIELDS} } }
  }
`;

export const SITE_SETTINGS_QUERY = defineQuery(`*[_id == "siteSettings"][0]{
  organizationName, legalName, tagline, logo, footerText, disclaimer,
  email, phone, address, socialLinks, defaultSeo
}`);

export const NAVIGATION_QUERY = defineQuery(`*[_id == "navigation"][0]{
  "header": header[]{ ${LINK_FIELDS} },
  "footer": footer[]{ ${LINK_FIELDS} }
}`);

export const HOME_PAGE_QUERY = defineQuery(
  `*[_id == "siteSettings"][0].homePage->{ ${PAGE_FIELDS} }`,
);

export const PAGE_BY_SLUG_QUERY = defineQuery(`*[
  _type == "page" && slug[$locale] == $slug && _id != ${HOME_PAGE_REF}
][0]{ ${PAGE_FIELDS} }`);

/** Finds a page by its slug in any language - lets /en/<indonesian-slug> redirect to the
 * English slug, which is what the language switcher relies on. */
export const PAGE_BY_ANY_SLUG_QUERY = defineQuery(`*[
  _type == "page" && $slug in [slug.id, slug.en] && _id != ${HOME_PAGE_REF}
][0]{ slug }`);

export const PAGE_SLUGS_QUERY = defineQuery(`*[
  _type == "page" && defined(slug) && _id != ${HOME_PAGE_REF}
]{ slug }`);

// Wrapped in React's cache() so generateMetadata and the page component share one request.

export const getSiteSettings = cache(() => sanityClient.fetch(SITE_SETTINGS_QUERY));
export const getNavigation = cache(() => sanityClient.fetch(NAVIGATION_QUERY));
export const getHomePage = cache(() => sanityClient.fetch(HOME_PAGE_QUERY));
export const getPageBySlug = cache((locale: string, slug: string) =>
  sanityClient.fetch(PAGE_BY_SLUG_QUERY, { locale, slug }),
);
export const getPageByAnySlug = cache((slug: string) =>
  sanityClient.fetch(PAGE_BY_ANY_SLUG_QUERY, { slug }),
);
export const getPageSlugs = cache(() => sanityClient.fetch(PAGE_SLUGS_QUERY));
