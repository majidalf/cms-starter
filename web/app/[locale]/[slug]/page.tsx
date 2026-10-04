import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { isLocale, localePath, pathsForAllLocales } from '@/lib/i18n';
import { localize, localizeSlug } from '@/lib/sanity/localize';
import {
  getPageByAnySlug,
  getPageBySlug,
  getPageSlugs,
  getSiteSettings,
} from '@/lib/sanity/queries';
import { buildMetadata } from '@/lib/seo';
import { PageView } from '@/components/PageView';

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const { locale } = params;
  if (!isLocale(locale)) return [];
  const pages = await getPageSlugs();
  return pages
    .map((page) => localizeSlug(page.slug, locale))
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const [page, settings] = await Promise.all([getPageBySlug(locale, slug), getSiteSettings()]);
  if (!page) return {};

  return buildMetadata({
    locale,
    title: localize(page.title, locale),
    seo: page.seo,
    defaults: settings?.defaultSeo,
    paths: pathsForAllLocales((lang) => {
      const langSlug = localizeSlug(page.slug, lang);
      return langSlug ? localePath(lang, `/${langSlug}`) : undefined;
    }),
  });
}

export default async function Page({ params }: PageProps<'/[locale]/[slug]'>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const page = await getPageBySlug(locale, slug);
  if (page) return <PageView page={page} locale={locale} />;

  // The slug may belong to the other language (e.g. the language switcher sent
  // /en/tentang-kami): send the visitor to this language's slug for the same page.
  const match = await getPageByAnySlug(slug);
  const localizedSlug = match ? localizeSlug(match.slug, locale) : undefined;
  if (localizedSlug && localizedSlug !== slug) redirect(localePath(locale, `/${localizedSlug}`));

  notFound();
}
