import { cache } from 'react';
import { defineQuery } from 'groq';
import { sanityClient } from './client';
import { CASE_STUDY_VISIBLE } from './fragments';

const HOME_PAGE_REF = `*[_id == "siteSettings"][0].homePage._ref`;

/**
 * Every routable document for app/sitemap.ts, with the same visibility rules as the pages
 * (no unapproved case studies) and without documents marked "Hide from search engines".
 * Sectors have no detail page, so `industry` is not listed. Removing a collection: drop its type here and in
 * SITEMAP_ROUTES (lib/sitemap.ts).
 */
export const SITEMAP_QUERY = defineQuery(`{
  "home": *[_id == "siteSettings"][0].homePage->{ _updatedAt, "noIndex": seo.noIndex },
  "documents": *[
    (
      (_type == "page" && _id != ${HOME_PAGE_REF})
      || _type in ["person", "service", "insight"]
      || (${CASE_STUDY_VISIBLE})
    )
    && defined(slug) && seo.noIndex != true
  ]{ _type, slug, _updatedAt }
}`);

export const getSitemapData = cache(() => sanityClient.fetch(SITEMAP_QUERY));
