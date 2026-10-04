import { cache } from 'react';
import { defineQuery } from 'groq';
import { sanityClient } from '../client';
import { CASE_STUDY_CARD, CASE_STUDY_VISIBLE, INDUSTRY_CARD, SERVICE_CARD } from '../fragments';

export const INDUSTRIES_QUERY = defineQuery(`*[_type == "industry" && defined(slug)]
  | order(order asc, title.id asc){ ${INDUSTRY_CARD} }`);

// Services point at industries (service.industries), so an industry finds its services
// through references() - the relation is stored once.
export const INDUSTRY_BY_SLUG_QUERY =
  defineQuery(`*[_type == "industry" && slug[$locale] == $slug][0]{
  ${INDUSTRY_CARD}, body, seo,
  "services": *[_type == "service" && references(^._id)] | order(order asc){ ${SERVICE_CARD} },
  "caseStudies": *[${CASE_STUDY_VISIBLE} && references(^._id)] | order(year desc){
    ${CASE_STUDY_CARD}
  }
}`);

export const INDUSTRY_BY_ANY_SLUG_QUERY = defineQuery(`*[
  _type == "industry" && $slug in [slug.id, slug.en]
][0]{ slug }`);

export const INDUSTRY_SLUGS_QUERY = defineQuery(`*[_type == "industry" && defined(slug)]{ slug }`);

export const getIndustries = cache(() => sanityClient.fetch(INDUSTRIES_QUERY));
export const getIndustryBySlug = cache((locale: string, slug: string) =>
  sanityClient.fetch(INDUSTRY_BY_SLUG_QUERY, { locale, slug }),
);
export const getIndustryByAnySlug = cache((slug: string) =>
  sanityClient.fetch(INDUSTRY_BY_ANY_SLUG_QUERY, { slug }),
);
export const getIndustrySlugs = cache(() => sanityClient.fetch(INDUSTRY_SLUGS_QUERY));
