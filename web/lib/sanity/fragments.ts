/*
 * GROQ fragments shared by the corporate preset queries (lib/sanity/collections/). Cards are
 * the fields a list or "related" block needs; detail queries project more.
 *
 * Visibility rules live here so no query can forget them: case studies need written client
 * consent and credentials need approval (CORPORATE_CLIENT_PLAN Section 5.1).
 */

export const CASE_STUDY_VISIBLE = `_type == "caseStudy" && clientConsent == true`;
export const CREDENTIAL_VISIBLE = `_type == "credential" && approvedForDisplay == true`;

// Lists sort by `coalesce(order, 9999)` so documents without an order come last, as the
// Studio field description ("Lower numbers are listed first") implies.

export const PERSON_CARD = `_id, name, titles, slug, position, group, photo, summary, focusAreas, email,
  "officeName": office->name`;
export const SERVICE_CARD = `_id, title, slug, summary`;
export const INDUSTRY_CARD = `_id, title, slug, summary`;
export const CASE_STUDY_CARD = `_id, title, slug, summary, client, year,
  "service": services[0]->{ _id, title },
  "industry": industries[0]->{ _id, title }`;
export const INSIGHT_CARD = `_id, title, slug, excerpt, category, publishedAt,
  "author": authors[0]->name`;
