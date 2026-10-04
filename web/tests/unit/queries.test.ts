import { beforeEach, describe, expect, it, vi } from 'vitest';

/*
 * The getters in lib/sanity/ are thin wrappers around sanityClient.fetch. These tests pin the
 * parameters they pass and the visibility rules baked into the query strings
 * (CORPORATE_CLIENT_PLAN Section 5.1). Query results are typed by typegen, and the queries
 * themselves are exercised against a real dataset by the E2E suite.
 */

const fetchMock = vi.fn().mockResolvedValue(null);
vi.mock('@/lib/sanity/client', () => ({ sanityClient: { fetch: fetchMock } }));

const person = await import('@/lib/sanity/collections/person');
const service = await import('@/lib/sanity/collections/service');
const industry = await import('@/lib/sanity/collections/industry');
const caseStudy = await import('@/lib/sanity/collections/caseStudy');
const insight = await import('@/lib/sanity/collections/insight');
const jobOpening = await import('@/lib/sanity/collections/jobOpening');
const office = await import('@/lib/sanity/collections/office');
const core = await import('@/lib/sanity/queries');
const sitemap = await import('@/lib/sanity/sitemapQuery');

beforeEach(() => fetchMock.mockClear());

/** [module, list getter, by-slug getter, by-any-slug getter, slugs getter, document type] */
const collections = [
  [
    person.getPeople,
    person.getPersonBySlug,
    person.getPersonByAnySlug,
    person.getPersonSlugs,
    'person',
  ],
  [
    service.getServices,
    service.getServiceBySlug,
    service.getServiceByAnySlug,
    service.getServiceSlugs,
    'service',
  ],
  [
    industry.getIndustries,
    industry.getIndustryBySlug,
    industry.getIndustryByAnySlug,
    industry.getIndustrySlugs,
    'industry',
  ],
  [
    caseStudy.getCaseStudies,
    caseStudy.getCaseStudyBySlug,
    caseStudy.getCaseStudyByAnySlug,
    caseStudy.getCaseStudySlugs,
    'caseStudy',
  ],
  [
    insight.getInsights,
    insight.getInsightBySlug,
    insight.getInsightByAnySlug,
    insight.getInsightSlugs,
    'insight',
  ],
  [
    jobOpening.getJobOpenings,
    jobOpening.getJobOpeningBySlug,
    jobOpening.getJobOpeningByAnySlug,
    jobOpening.getJobOpeningSlugs,
    'jobOpening',
  ],
] as const;

describe.each(collections)('collection getters (%#)', (list, bySlug, byAnySlug, slugs, type) => {
  it(`query ${type} with the right parameters`, async () => {
    await list();
    expect(fetchMock.mock.calls.at(-1)?.[0]).toContain(`_type == "${type}"`);

    await bySlug('en', `${type}-slug-a`);
    expect(fetchMock.mock.calls.at(-1)?.[1]).toEqual({ locale: 'en', slug: `${type}-slug-a` });
    expect(fetchMock.mock.calls.at(-1)?.[0]).toContain('slug[$locale] == $slug');

    await byAnySlug(`${type}-slug-b`);
    expect(fetchMock.mock.calls.at(-1)?.[1]).toEqual({ slug: `${type}-slug-b` });

    await slugs();
    expect(fetchMock.mock.calls.at(-1)?.[0]).toContain('defined(slug)');
  });
});

describe('visibility rules', () => {
  it('every case study query requires client consent', () => {
    for (const query of [
      caseStudy.CASE_STUDIES_QUERY,
      caseStudy.CASE_STUDY_BY_SLUG_QUERY,
      caseStudy.CASE_STUDY_BY_ANY_SLUG_QUERY,
      caseStudy.CASE_STUDY_SLUGS_QUERY,
    ]) {
      expect(query).toContain('clientConsent == true');
    }
    // Case studies shown on other pages too.
    expect(service.SERVICE_BY_SLUG_QUERY).toContain(
      '_type == "caseStudy" && clientConsent == true',
    );
    expect(industry.INDUSTRY_BY_SLUG_QUERY).toContain(
      '_type == "caseStudy" && clientConsent == true',
    );
    expect(sitemap.SITEMAP_QUERY).toContain('_type == "caseStudy" && clientConsent == true');
    expect(sitemap.SITEMAP_QUERY).not.toMatch(/_type in \[[^\]]*"caseStudy"/);
  });

  it('every job opening query requires an open position', () => {
    for (const query of [
      jobOpening.JOB_OPENINGS_QUERY,
      jobOpening.JOB_OPENING_BY_SLUG_QUERY,
      jobOpening.JOB_OPENING_BY_ANY_SLUG_QUERY,
      jobOpening.JOB_OPENING_SLUGS_QUERY,
      sitemap.SITEMAP_QUERY,
    ]) {
      expect(query).toContain('_type == "jobOpening" && isOpen == true');
    }
  });

  it('credentials on pages require approval', () => {
    expect(core.PAGE_BY_SLUG_QUERY).toContain(
      '_type == "credential" && approvedForDisplay == true',
    );
    expect(core.HOME_PAGE_QUERY).toContain('_type == "credential" && approvedForDisplay == true');
  });

  it('the sitemap leaves out documents hidden from search engines', () => {
    expect(sitemap.SITEMAP_QUERY).toContain('seo.noIndex != true');
  });
});

describe('other getters', () => {
  it('pass their parameters through', async () => {
    await office.getOffices();
    expect(fetchMock.mock.calls.at(-1)?.[0]).toContain('_type == "office"');
    await core.getPageBySlug('id', 'tentang');
    expect(fetchMock.mock.calls.at(-1)?.[1]).toEqual({ locale: 'id', slug: 'tentang' });
    await core.getPageByAnySlug('about');
    expect(fetchMock.mock.calls.at(-1)?.[1]).toEqual({ slug: 'about' });
    fetchMock.mockClear();
    const getters = [
      core.getSiteSettings,
      core.getNavigation,
      core.getHomePage,
      core.getPageSlugs,
      sitemap.getSitemapData,
    ];
    await Promise.all(getters.map((getter) => getter()));
    expect(fetchMock).toHaveBeenCalledTimes(getters.length);
  });
});
