import { cache } from 'react';
import { defineQuery } from 'groq';
import { sanityClient } from '../client';
import { INDUSTRY_CARD } from '../fragments';

// Sectors are listed by name only (design: no detail page), so there is one query.
export const INDUSTRIES_QUERY = defineQuery(`*[_type == "industry" && defined(slug)]
  | order(coalesce(order, 9999) asc, title.id asc){ ${INDUSTRY_CARD} }`);

export const getIndustries = cache(() => sanityClient.fetch(INDUSTRIES_QUERY));
