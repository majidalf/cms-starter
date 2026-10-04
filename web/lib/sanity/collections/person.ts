import { cache } from 'react';
import { defineQuery } from 'groq';
import { sanityClient } from '../client';
import { INSIGHT_CARD, PERSON_CARD, SERVICE_CARD } from '../fragments';

export const PEOPLE_QUERY = defineQuery(`*[_type == "person" && defined(slug)]
  | order(coalesce(order, 9999) asc, name asc){ ${PERSON_CARD} }`);

export const PERSON_BY_SLUG_QUERY = defineQuery(`*[_type == "person" && slug[$locale] == $slug][0]{
  ${PERSON_CARD}, bio, credentials, languages, email, linkedin, seo,
  "services": services[defined(@->slug)]->{ ${SERVICE_CARD} },
  "office": office->{ name, address, phone, email },
  "insights": *[_type == "insight" && references(^._id)] | order(publishedAt desc)[0...3]{
    ${INSIGHT_CARD}
  }
}`);

export const PERSON_BY_ANY_SLUG_QUERY = defineQuery(`*[
  _type == "person" && $slug in [slug.id, slug.en]
][0]{ slug }`);

export const PERSON_SLUGS_QUERY = defineQuery(`*[_type == "person" && defined(slug)]{ slug }`);

export const getPeople = cache(() => sanityClient.fetch(PEOPLE_QUERY));
export const getPersonBySlug = cache((locale: string, slug: string) =>
  sanityClient.fetch(PERSON_BY_SLUG_QUERY, { locale, slug }),
);
export const getPersonByAnySlug = cache((slug: string) =>
  sanityClient.fetch(PERSON_BY_ANY_SLUG_QUERY, { slug }),
);
export const getPersonSlugs = cache(() => sanityClient.fetch(PERSON_SLUGS_QUERY));
