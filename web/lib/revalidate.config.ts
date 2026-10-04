/**
 * Which paths to revalidate when Sanity publishes a document of a given `_type`.
 * This map is the only thing a new project should need to edit - the webhook handler
 * in app/api/revalidate/route.ts stays generic.
 *
 * The Sanity webhook must send a projection like `{"_type": _type, "slug": slug.current}`.
 */

export interface RevalidatePayload {
  _type?: string;
  slug?: string;
}

export interface RevalidateTarget {
  path: string;
  /** 'layout' also revalidates every page nested under `path`. */
  type?: 'page' | 'layout';
}

type Resolver = (payload: RevalidatePayload) => RevalidateTarget[];

/** Revalidates the whole site - for documents that appear in the shared layout
 * (navigation, footer, site settings), and as the fallback for unmapped types. */
const wholeSite: Resolver = () => [{ path: '/', type: 'layout' }];

export const revalidateMap: Record<string, Resolver> = {
  siteSettings: wholeSite,
  navigation: wholeSite,
  page: ({ slug }) => [{ path: '/' }, ...(slug ? [{ path: `/${slug}` }] : [])],
};

/** Unknown `_type`s fall back to revalidating everything: slower, but never stale. */
export function resolveRevalidateTargets(payload: RevalidatePayload): RevalidateTarget[] {
  const resolver = (payload._type && revalidateMap[payload._type]) || wholeSite;
  return resolver(payload);
}
