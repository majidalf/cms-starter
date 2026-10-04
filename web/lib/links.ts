import { localePath, type Locale } from '@/lib/i18n';
import { localize, localizeSlug } from '@/lib/sanity/localize';

/** Shape of a `link` object as projected by LINK_FIELDS in lib/sanity/queries.ts. */
export interface LinkValue {
  _key?: string | null;
  label?: Partial<Record<Locale, string | null>> | null;
  linkType?: string | null;
  path?: string | null;
  url?: string | null;
  pageSlug?: Partial<Record<Locale, string | null>> | null;
  isHomePage?: boolean | null;
}

const SAFE_HREF = /^(https?:|mailto:|tel:|\/)/i;

/** Only http(s), mailto, tel and on-site paths may reach an href - never `javascript:` and
 * the like, even if content bypassed Studio validation (e.g. an API import). */
export function safeHref(href: string | null | undefined): string | undefined {
  return href && SAFE_HREF.test(href) ? href : undefined;
}

/** "+62 21 0000 0000" -> "tel:+622100000000" */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export interface ResolvedLink {
  key: string;
  label: string;
  href: string;
  isExternal: boolean;
}

/** Turns a Sanity link into a label + href for one language. Returns undefined for a link
 * that can't be resolved (e.g. it points to a deleted page) so it is skipped, not broken. */
export function resolveLink(link: LinkValue, locale: Locale): ResolvedLink | undefined {
  const label = localize(link.label, locale);
  if (!label) return undefined;

  let href: string | undefined;
  if (link.linkType === 'external') href = safeHref(link.url);
  else if (link.linkType === 'path' && link.path) href = localePath(locale, link.path);
  else if (link.linkType === 'page' && link.isHomePage) href = localePath(locale);
  else if (link.linkType === 'page') {
    const slug = localizeSlug(link.pageSlug, locale);
    href = slug ? localePath(locale, `/${slug}`) : undefined;
  }
  if (!href) return undefined;

  return {
    key: link._key ?? href,
    label,
    href,
    isExternal: link.linkType === 'external',
  };
}

export function resolveLinks(
  links: LinkValue[] | null | undefined,
  locale: Locale,
): ResolvedLink[] {
  return (links ?? [])
    .map((link) => resolveLink(link, locale))
    .filter((link): link is ResolvedLink => Boolean(link));
}
