import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { detailPaths, redirectToLocalizedSlug, slugParams } from '@/lib/collectionRoutes';
import { isLocale } from '@/lib/i18n';
import { localize } from '@/lib/sanity/localize';
import {
  getPageByAnySlug,
  getPageBySlug,
  getPageSlugs,
  getSiteSettings,
} from '@/lib/sanity/queries';
import { buildMetadata } from '@/lib/seo';
import { PageView } from '@/components/PageView';

// Top-level pages have no route prefix. A folder in app/[locale]/ (e.g. services/) wins over
// this route, so a page whose slug equals a preset route name is never reachable.
const BASE = '';

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  return slugParams(await getPageSlugs(), params.locale);
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
    paths: detailPaths(BASE, page.slug),
  });
}

export default async function Page({ params }: PageProps<'/[locale]/[slug]'>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const page = await getPageBySlug(locale, slug);
  if (!page) return redirectToLocalizedSlug(locale, slug, BASE, getPageByAnySlug);
  return <PageView page={page} locale={locale} />;
}
