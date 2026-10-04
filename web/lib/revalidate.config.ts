/**
 * Which paths to revalidate when Sanity publishes a document of a given `_type`.
 * This map is the only thing a new project should need to edit - the webhook handler
 * in app/api/revalidate/route.ts stays generic.
 *
 * The Sanity webhook must send this projection:
 *   {"_type": _type, "slugs": slug}
 */
import type { Locale } from '@/lib/i18n';

export interface RevalidatePayload {
  _type?: string;
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

export const revalidateMap: Record<string, Resolver> = {
  siteSettings: wholeSite,
  navigation: wholeSite,
  // Pages can be linked from the header/footer menus, so a slug or title change has to
  // reach every page, not just this one.
  page: wholeSite,
};

/** Unknown `_type`s fall back to revalidating everything: slower, but never stale. */
export function resolveRevalidateTargets(payload: RevalidatePayload): RevalidateTarget[] {
  const resolver = (payload._type && revalidateMap[payload._type]) || wholeSite;
  return resolver(payload);
}
