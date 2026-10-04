/**
 * Which paths to revalidate when Sanity publishes a document of a given `_type`.
 * This map is the only thing a new project should need to edit - the webhook handler
 * in app/api/revalidate/route.ts stays generic.
 *
 * The Sanity webhook (trigger on create, update and delete; published documents only) must
 * send this projection:
 *   {"_id": _id, "_rev": _rev, "_type": _type, "operation": delta::operation(), "slugs": slug}
 * `_id`, `_rev` and `operation` let the handler wait until the change is queryable before
 * revalidating (see lib/sanity/revision.ts).
 */
import type { Locale } from '@/lib/i18n';
import { routes, type CollectionRoute } from '@/lib/routes';
import type { DocumentOperation } from '@/lib/sanity/revision';

export interface RevalidatePayload {
  _id?: string;
  _rev?: string;
  _type?: string;
  operation?: DocumentOperation;
  slugs?: Partial<Record<Locale, string | null>> | null;
}

export interface RevalidateTarget {
  path: string;
  /** 'layout' also revalidates every page nested under `path`. */
  type?: 'page' | 'layout';
}

type Resolver = (payload: RevalidatePayload) => RevalidateTarget[];

/** Revalidates every page in every language (the root layout lives at app/[locale]). */
const wholeSite: Resolver = () => [{ path: '/[locale]', type: 'layout' }];

/** Revalidates a corporate preset route's list page and every detail page below it, in
 * every language - e.g. /id/services, /en/services/<any slug>. Documents show up on each
 * other's pages (a service lists its key contacts, case studies and insights), so each type
 * names every route its cards appear on. */
const collections =
  (...bases: CollectionRoute[]): Resolver =>
  () =>
    bases.map((base) => ({ path: `/[locale]${base}`, type: 'layout' }));

export const revalidateMap: Record<string, Resolver> = {
  siteSettings: wholeSite,
  navigation: wholeSite,
  // Pages can be linked from the header/footer menus, so a slug or title change has to
  // reach every page, not just this one.
  page: wholeSite,
  // Corporate preset. Remove a type's entry together with its collection.
  person: collections(routes.leadership, routes.services, routes.insights),
  service: collections(
    routes.services,
    routes.industries,
    routes.caseStudies,
    routes.insights,
    routes.leadership,
  ),
  industry: collections(routes.industries, routes.services, routes.caseStudies),
  caseStudy: collections(routes.caseStudies, routes.services, routes.industries),
  insight: collections(routes.insights, routes.services, routes.leadership),
  jobOpening: collections(routes.careers),
  // Offices are in the footer; credentials are a page builder section on any page.
  office: wholeSite,
  credential: wholeSite,
};

/** app/sitemap.ts lives outside /[locale], so no layout revalidation reaches it. Any publish
 * can add, rename or hide a URL, so it is refreshed on every webhook. */
const SITEMAP: RevalidateTarget = { path: '/sitemap.xml' };

/** Unknown `_type`s fall back to revalidating everything: slower, but never stale. */
export function resolveRevalidateTargets(payload: RevalidatePayload): RevalidateTarget[] {
  const resolver = (payload._type && revalidateMap[payload._type]) || wholeSite;
  return [...resolver(payload), SITEMAP];
}
