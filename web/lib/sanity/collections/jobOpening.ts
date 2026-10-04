import { cache } from 'react';
import { defineQuery } from 'groq';
import { sanityClient } from '../client';
import { JOB_OPENING_CARD, JOB_OPENING_VISIBLE } from '../fragments';

// Closed openings (isOpen off) are filtered out everywhere, slug lookups included.

export const JOB_OPENINGS_QUERY = defineQuery(`*[${JOB_OPENING_VISIBLE} && defined(slug)]
  | order(_createdAt desc){ ${JOB_OPENING_CARD} }`);

export const JOB_OPENING_BY_SLUG_QUERY = defineQuery(`*[
  ${JOB_OPENING_VISIBLE} && slug[$locale] == $slug
][0]{ ${JOB_OPENING_CARD}, description, applyUrl, seo }`);

export const JOB_OPENING_BY_ANY_SLUG_QUERY = defineQuery(`*[
  ${JOB_OPENING_VISIBLE} && $slug in [slug.id, slug.en]
][0]{ slug }`);

export const JOB_OPENING_SLUGS_QUERY = defineQuery(`*[
  ${JOB_OPENING_VISIBLE} && defined(slug)
]{ slug }`);

export const getJobOpenings = cache(() => sanityClient.fetch(JOB_OPENINGS_QUERY));
export const getJobOpeningBySlug = cache((locale: string, slug: string) =>
  sanityClient.fetch(JOB_OPENING_BY_SLUG_QUERY, { locale, slug }),
);
export const getJobOpeningByAnySlug = cache((slug: string) =>
  sanityClient.fetch(JOB_OPENING_BY_ANY_SLUG_QUERY, { slug }),
);
export const getJobOpeningSlugs = cache(() => sanityClient.fetch(JOB_OPENING_SLUGS_QUERY));
