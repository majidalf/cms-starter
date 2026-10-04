/*
 * GROQ fragments shared by the corporate preset queries (lib/sanity/collections/). Cards are
 * the fields a list or "related" block needs; detail queries project more.
 *
 * Visibility rules live here so no query can forget them: case studies need written client
 * consent and credentials need approval (CORPORATE_CLIENT_PLAN Section 5.1), job openings
 * must be open.
 */

export const CASE_STUDY_VISIBLE = `_type == "caseStudy" && clientConsent == true`;
export const CREDENTIAL_VISIBLE = `_type == "credential" && approvedForDisplay == true`;
export const JOB_OPENING_VISIBLE = `_type == "jobOpening" && isOpen == true`;

// Lists sort by `coalesce(order, 9999)` so documents without an order come last, as the
// Studio field description ("Lower numbers are listed first") implies.

export const PERSON_CARD = `_id, name, slug, position, group, photo`;
export const SERVICE_CARD = `_id, title, slug, summary`;
export const INDUSTRY_CARD = `_id, title, slug, summary`;
export const CASE_STUDY_CARD = `_id, title, slug, summary, client, year`;
export const INSIGHT_CARD = `_id, title, slug, excerpt, category, publishedAt`;
export const JOB_OPENING_CARD = `_id, title, slug, location, employmentType, deadline`;
