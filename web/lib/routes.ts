/**
 * Corporate preset route names, without the language prefix (plan Section 4.3). Used by
 * page links, the revalidate map and (from T3) the sitemap.
 *
 * Renaming a route (e.g. /services -> /practice-areas) means changing the value here AND
 * renaming the matching folder in app/[locale]/ - Next.js routes come from folder names,
 * so the two must agree. Also update RESERVED_PAGE_SLUGS in
 * studio/schemaTypes/objects/localeSlug.ts, which stops pages from taking these slugs.
 */
export const routes = {
  leadership: '/about/leadership',
  services: '/services',
  industries: '/industries',
  caseStudies: '/case-studies',
  insights: '/insights',
  careers: '/careers',
  contact: '/contact',
} as const;

export type CollectionRoute = (typeof routes)[keyof typeof routes];
