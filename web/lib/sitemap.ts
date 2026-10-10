import type { MetadataRoute } from 'next';
import { detailPaths, listPaths } from '@/lib/collectionRoutes';
import { defaultLocale, locales, localePath, pathsForAllLocales, type Locale } from '@/lib/i18n';
import { routes } from '@/lib/routes';

type LocalizedSlug = Partial<Record<Locale, string | null>> | null;

export interface SitemapDocument {
  _type: string;
  slug: LocalizedSlug;
  _updatedAt: string;
}

export interface SitemapData {
  home: { _updatedAt: string; noIndex: boolean | null } | null;
  documents: SitemapDocument[];
}

/** Route prefix of each sitemap document type ('' = top-level page). Keep in step with
 * SITEMAP_QUERY (lib/sanity/sitemapQuery.ts) when adding or removing a collection. */
export const SITEMAP_ROUTES: Record<string, string> = {
  page: '',
  person: routes.leadership,
  service: routes.services,
  caseStudy: routes.caseStudies,
  insight: routes.insights,
};

/**
 * One sitemap entry per language version, each listing every language as an alternate -
 * the form Google documents for multilingual sitemaps. `x-default` points at the default
 * language, matching the pages' own hreflang.
 */
function entriesFor(
  paths: Partial<Record<Locale, string>>,
  siteUrl: URL,
  lastModified?: string,
): MetadataRoute.Sitemap {
  const absolute = (path: string) => new URL(path, siteUrl).toString();
  const languages: Record<string, string> = {};
  for (const lang of locales) {
    const path = paths[lang];
    if (path) languages[lang] = absolute(path);
  }
  const defaultPath = paths[defaultLocale];
  if (defaultPath) languages['x-default'] = absolute(defaultPath);

  return locales.flatMap((lang) => {
    const path = paths[lang];
    if (!path) return [];
    return [
      {
        url: absolute(path),
        ...(lastModified ? { lastModified } : {}),
        alternates: { languages },
      },
    ];
  });
}

export function buildSitemap(data: SitemapData, siteUrl: URL): MetadataRoute.Sitemap {
  const home =
    data.home && !data.home.noIndex
      ? entriesFor(
          pathsForAllLocales((lang) => localePath(lang)),
          siteUrl,
          data.home._updatedAt,
        )
      : [];
  const lists = Object.values(routes).flatMap((base) => entriesFor(listPaths(base), siteUrl));
  const documents = data.documents.flatMap((doc) => {
    const base = SITEMAP_ROUTES[doc._type];
    if (base === undefined) return [];
    return entriesFor(detailPaths(base, doc.slug), siteUrl, doc._updatedAt);
  });
  return [...home, ...lists, ...documents];
}
