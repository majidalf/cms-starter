import type { Metadata } from 'next';
import { detailPaths, listPaths } from '@/lib/collectionRoutes';
import { getDictionary, isLocale, type Dictionary, type Locale } from '@/lib/i18n';
import { getSiteSettings } from '@/lib/sanity/queries';
import { buildMetadata, type SeoValue } from '@/lib/seo';

/** generateMetadata for a corporate preset list page (/services, /insights, ...). Its title
 * is fixed UI text from the dictionary. */
export async function listPageMetadata(
  params: Promise<{ locale: string }>,
  base: string,
  pickTitle: (t: Dictionary) => string,
): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const settings = await getSiteSettings();
  return buildMetadata({
    locale,
    title: pickTitle(getDictionary(locale)),
    defaults: settings?.defaultSeo,
    paths: listPaths(base),
  });
}

interface DetailDoc {
  slug: Partial<Record<Locale, string | null>> | null;
  seo: SeoValue | null;
  /** Already localized. */
  title: string | undefined;
  /** Summary or excerpt, already localized - the meta description fallback. */
  description?: string;
}

/** generateMetadata for a corporate preset detail page. `doc` is null when the slug has no
 * match (the page itself then redirects or 404s). */
export async function detailPageMetadata(
  locale: Locale,
  base: string,
  doc: DetailDoc | null,
): Promise<Metadata> {
  if (!doc) return {};
  const settings = await getSiteSettings();
  return buildMetadata({
    locale,
    title: doc.title,
    description: doc.description,
    seo: doc.seo,
    defaults: settings?.defaultSeo,
    paths: detailPaths(base, doc.slug),
  });
}
