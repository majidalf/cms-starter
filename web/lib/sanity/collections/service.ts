import { cache } from 'react';
import { defineQuery } from 'groq';
import { sanityClient } from '../client';
import {
  CASE_STUDY_CARD,
  CASE_STUDY_VISIBLE,
  INDUSTRY_CARD,
  INSIGHT_CARD,
  PERSON_CARD,
  SERVICE_CARD,
} from '../fragments';

export const SERVICES_QUERY = defineQuery(`*[_type == "service" && defined(slug)]
  | order(coalesce(order, 9999) asc, title.id asc){ ${SERVICE_CARD} }`);

/** The home page index: each area with what its detail panel shows. */
export const SERVICE_PANELS_QUERY = defineQuery(`*[_type == "service" && defined(slug)]
  | order(coalesce(order, 9999) asc, title.id asc){
  ${SERVICE_CARD},
  "scope": scope[featured == true][0...3].text,
  legalBasis
}`);

export const SERVICE_BY_SLUG_QUERY =
  defineQuery(`*[_type == "service" && slug[$locale] == $slug][0]{
  ${SERVICE_CARD}, "scope": scope[].text, legalBasis, body, seo,
  "keyContacts": keyContacts[defined(@->slug)]->{ ${PERSON_CARD} },
  "industries": industries[defined(@->slug)]->{ ${INDUSTRY_CARD} },
  "caseStudies": *[${CASE_STUDY_VISIBLE} && references(^._id)] | order(year desc){
    ${CASE_STUDY_CARD}
  },
  "insights": *[_type == "insight" && references(^._id)] | order(publishedAt desc)[0...3]{
    ${INSIGHT_CARD}
  }
}`);

export const SERVICE_BY_ANY_SLUG_QUERY = defineQuery(`*[
  _type == "service" && $slug in [slug.id, slug.en]
][0]{ slug }`);

export const SERVICE_SLUGS_QUERY = defineQuery(`*[_type == "service" && defined(slug)]{ slug }`);

export const getServices = cache(() => sanityClient.fetch(SERVICES_QUERY));
export const getServicePanels = cache(() => sanityClient.fetch(SERVICE_PANELS_QUERY));
export const getServiceBySlug = cache((locale: string, slug: string) =>
  sanityClient.fetch(SERVICE_BY_SLUG_QUERY, { locale, slug }),
);
export const getServiceByAnySlug = cache((slug: string) =>
  sanityClient.fetch(SERVICE_BY_ANY_SLUG_QUERY, { slug }),
);
export const getServiceSlugs = cache(() => sanityClient.fetch(SERVICE_SLUGS_QUERY));
