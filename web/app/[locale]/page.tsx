import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, localePath, pathsForAllLocales } from '@/lib/i18n';
import { getHomePage, getSiteSettings } from '@/lib/sanity/queries';
import { websiteJsonLd } from '@/lib/jsonLd';
import { buildMetadata } from '@/lib/seo';
import { absoluteUrl, siteUrl } from '@/lib/site';
import { JsonLd } from '@/components/JsonLd';
import { PageView } from '@/components/PageView';

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const [page, settings] = await Promise.all([getHomePage(), getSiteSettings()]);
  // No `title`: the home page uses the layout's default (the organization name).
  return buildMetadata({
    locale,
    seo: page?.seo,
    defaults: settings?.defaultSeo,
    paths: pathsForAllLocales((lang) => localePath(lang)),
  });
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [page, settings] = await Promise.all([getHomePage(), getSiteSettings()]);
  if (!page) {
    throw new Error('No home page. Choose one under "Site settings → Home page" in Studio.');
  }
  const structuredData = websiteJsonLd({
    name: settings?.organizationName ?? '',
    url: absoluteUrl(localePath(locale)),
    language: locale,
    organizationUrl: siteUrl.origin,
  });

  return (
    <>
      <JsonLd data={structuredData} />
      <PageView page={page} locale={locale} />
    </>
  );
}
