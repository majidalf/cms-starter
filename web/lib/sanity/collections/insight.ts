import { cache } from 'react';
import { defineQuery } from 'groq';
import { sanityClient } from '../client';
import { INSIGHT_CARD, PERSON_CARD, SERVICE_CARD } from '../fragments';

export const INSIGHTS_QUERY = defineQuery(`*[_type == "insight" && defined(slug)]
  | order(publishedAt desc, _createdAt desc){ ${INSIGHT_CARD} }`);

export const INSIGHT_BY_SLUG_QUERY =
  defineQuery(`*[_type == "insight" && slug[$locale] == $slug][0]{
  ${INSIGHT_CARD}, body, seo,
  "attachmentUrl": attachment.asset->url,
  "authors": authors[defined(@->slug)]->{ ${PERSON_CARD} },
  "services": services[defined(@->slug)]->{ ${SERVICE_CARD} }
}`);

export const INSIGHT_BY_ANY_SLUG_QUERY = defineQuery(`*[
  _type == "insight" && $slug in [slug.id, slug.en]
][0]{ slug }`);

export const INSIGHT_SLUGS_QUERY = defineQuery(`*[_type == "insight" && defined(slug)]{ slug }`);

export const getInsights = cache(() => sanityClient.fetch(INSIGHTS_QUERY));
export const getInsightBySlug = cache((locale: string, slug: string) =>
  sanityClient.fetch(INSIGHT_BY_SLUG_QUERY, { locale, slug }),
);
export const getInsightByAnySlug = cache((slug: string) =>
  sanityClient.fetch(INSIGHT_BY_ANY_SLUG_QUERY, { slug }),
);
export const getInsightSlugs = cache(() => sanityClient.fetch(INSIGHT_SLUGS_QUERY));
