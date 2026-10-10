import { describe, expect, it } from 'vitest';
import { resolveRevalidateTargets, revalidateMap } from '@/lib/revalidate.config';
import { routes } from '@/lib/routes';

const WHOLE_SITE = { path: '/[locale]', type: 'layout' };
const SITEMAP = { path: '/sitemap.xml' };
const layout = (route: string) => ({ path: `/[locale]${route}`, type: 'layout' });

describe('resolveRevalidateTargets', () => {
  it.each([
    'siteSettings',
    'navigation',
    'page',
    'office',
    'credential',
    // Shown on the home page and on each other's pages.
    'person',
    'service',
    'industry',
    'insight',
  ])('%s revalidates the whole site', (type) => {
    expect(resolveRevalidateTargets({ _type: type })).toEqual([WHOLE_SITE, SITEMAP]);
  });

  it('falls back to the whole site for unknown or missing types', () => {
    expect(resolveRevalidateTargets({ _type: 'somethingNew' })).toEqual([WHOLE_SITE, SITEMAP]);
    expect(resolveRevalidateTargets({})).toEqual([WHOLE_SITE, SITEMAP]);
  });

  it('a matter revalidates the Experience pages and the sitemap', () => {
    expect(resolveRevalidateTargets({ _type: 'caseStudy' })).toEqual([
      layout(routes.caseStudies),
      SITEMAP,
    ]);
    expect(revalidateMap.caseStudy?.({ _type: 'caseStudy' })).toContainEqual(
      layout(routes.caseStudies),
    );
  });
});
