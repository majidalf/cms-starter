import { describe, expect, it } from 'vitest';
import { resolveRevalidateTargets, revalidateMap } from '@/lib/revalidate.config';
import { routes } from '@/lib/routes';

const WHOLE_SITE = { path: '/[locale]', type: 'layout' };
const SITEMAP = { path: '/sitemap.xml' };
const layout = (route: string) => ({ path: `/[locale]${route}`, type: 'layout' });

describe('resolveRevalidateTargets', () => {
  it.each(['siteSettings', 'navigation', 'page', 'office', 'credential'])(
    '%s revalidates the whole site',
    (type) => {
      expect(resolveRevalidateTargets({ _type: type })).toEqual([WHOLE_SITE, SITEMAP]);
    },
  );

  it('falls back to the whole site for unknown or missing types', () => {
    expect(resolveRevalidateTargets({ _type: 'somethingNew' })).toEqual([WHOLE_SITE, SITEMAP]);
    expect(resolveRevalidateTargets({})).toEqual([WHOLE_SITE, SITEMAP]);
  });

  it('revalidates every route a type appears on, plus the sitemap', () => {
    expect(resolveRevalidateTargets({ _type: 'person' })).toEqual([
      layout(routes.leadership),
      layout(routes.services),
      layout(routes.insights),
      SITEMAP,
    ]);
    expect(resolveRevalidateTargets({ _type: 'jobOpening' })).toEqual([
      layout(routes.careers),
      SITEMAP,
    ]);
  });

  it('always includes the type’s own route', () => {
    const own: Record<string, string> = {
      person: routes.leadership,
      service: routes.services,
      industry: routes.industries,
      caseStudy: routes.caseStudies,
      insight: routes.insights,
      jobOpening: routes.careers,
    };
    for (const [type, route] of Object.entries(own)) {
      expect(revalidateMap[type]({ _type: type })).toContainEqual(layout(route));
    }
  });
});
