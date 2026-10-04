import { notFound, redirect } from 'next/navigation';
import { isLocale, localePath, pathsForAllLocales, type Locale } from '@/lib/i18n';
import { localizeSlug } from '@/lib/sanity/localize';

/*
 * Shared steps of every slug-based page: app/[locale]/[slug] and each corporate preset
 * detail page (app/[locale]/services/[slug], ...). `base` is the route without language
 * prefix, from lib/routes.ts ('' for top-level pages).
 */

type LocalizedSlug = Partial<Record<Locale, string | null>> | null | undefined;

/** `/id/services/audit`: the detail path in one language, or undefined without a slug. */
export function detailPath(locale: Locale, base: string, slug: LocalizedSlug): string | undefined {
  const localized = localizeSlug(slug, locale);
  return localized ? localePath(locale, `${base}/${localized}`) : undefined;
}

/** A list page's path in every language, e.g. /id/services and /en/services. */
export function listPaths(base: string): Partial<Record<Locale, string>> {
  return pathsForAllLocales((lang) => localePath(lang, base));
}

/** The same document's path in every language, for hreflang. */
export function detailPaths(base: string, slug: LocalizedSlug): Partial<Record<Locale, string>> {
  return pathsForAllLocales((lang) => detailPath(lang, base, slug));
}

/** generateStaticParams for a [slug] segment under [locale]. */
export function slugParams(docs: { slug: LocalizedSlug }[], locale: string): { slug: string }[] {
  if (!isLocale(locale)) return [];
  return docs
    .map((doc) => localizeSlug(doc.slug, locale))
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
}

/**
 * For a slug with no match in this language: it may belong to the other language (e.g. the
 * language switcher sent /en/services/<indonesian-slug>), so redirect to this language's slug
 * of the same document. Anything else is a 404.
 */
export async function redirectToLocalizedSlug(
  locale: Locale,
  slug: string,
  base: string,
  findByAnySlug: (slug: string) => Promise<{ slug: LocalizedSlug } | null>,
): Promise<never> {
  const match = await findByAnySlug(slug);
  const localizedSlug = match ? localizeSlug(match.slug, locale) : undefined;
  if (localizedSlug && localizedSlug !== slug)
    redirect(localePath(locale, `${base}/${localizedSlug}`));
  notFound();
}
