import { cache } from 'react';
import { defineQuery } from 'groq';
import { sanityClient } from '../client';
import { CASE_STUDY_CARD, CASE_STUDY_VISIBLE, INDUSTRY_CARD, SERVICE_CARD } from '../fragments';

// Every query here filters on CASE_STUDY_VISIBLE (client consent) - including the slug
// lookups, so an unapproved case study can't even be found through a redirect.

export const CASE_STUDIES_QUERY = defineQuery(`*[${CASE_STUDY_VISIBLE} && defined(slug)]
  | order(year desc, title.id asc){ ${CASE_STUDY_CARD} }`);

export const CASE_STUDY_BY_SLUG_QUERY = defineQuery(`*[
  ${CASE_STUDY_VISIBLE} && slug[$locale] == $slug
][0]{
  ${CASE_STUDY_CARD}, challenge, approach, outcome, seo,
  "services": services[defined(@->slug)]->{ ${SERVICE_CARD} },
  "industries": industries[defined(@->slug)]->{ ${INDUSTRY_CARD} }
}`);

export const CASE_STUDY_BY_ANY_SLUG_QUERY = defineQuery(`*[
  ${CASE_STUDY_VISIBLE} && $slug in [slug.id, slug.en]
][0]{ slug }`);

export const CASE_STUDY_SLUGS_QUERY = defineQuery(`*[
  ${CASE_STUDY_VISIBLE} && defined(slug)
]{ slug }`);

export const getCaseStudies = cache(() => sanityClient.fetch(CASE_STUDIES_QUERY));
export const getCaseStudyBySlug = cache((locale: string, slug: string) =>
  sanityClient.fetch(CASE_STUDY_BY_SLUG_QUERY, { locale, slug }),
);
export const getCaseStudyByAnySlug = cache((slug: string) =>
  sanityClient.fetch(CASE_STUDY_BY_ANY_SLUG_QUERY, { slug }),
);
export const getCaseStudySlugs = cache(() => sanityClient.fetch(CASE_STUDY_SLUGS_QUERY));
