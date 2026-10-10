import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, localePath, pathsForAllLocales } from '@/lib/i18n';
import { getIndustries } from '@/lib/sanity/collections/industry';
import { getInsights } from '@/lib/sanity/collections/insight';
import { getOffices } from '@/lib/sanity/collections/office';
import { getPeople } from '@/lib/sanity/collections/person';
import { getServices } from '@/lib/sanity/collections/service';
import { getHomePage, getSiteSettings } from '@/lib/sanity/queries';
import { websiteJsonLd } from '@/lib/jsonLd';
import { buildMetadata } from '@/lib/seo';
import { absoluteUrl, siteUrl } from '@/lib/site';
import { JsonLd } from '@/components/JsonLd';
import { PageView } from '@/components/PageView';
import { AboutSection } from '@/components/sections/AboutSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { InsightsSection } from '@/components/sections/InsightsSection';
import { PartnersSection } from '@/components/sections/PartnersSection';
import { PracticeAreasSection } from '@/components/sections/PracticeAreasSection';
import { SectorsSection } from '@/components/sections/SectorsSection';

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

  const [page, settings, services, industries, insights, people, offices] = await Promise.all([
    getHomePage(),
    getSiteSettings(),
    getServices(),
    getIndustries(),
    getInsights(),
    getPeople(),
    getOffices(),
  ]);
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
      <AboutSection
        locale={locale}
        serviceCount={services.length}
        industryCount={industries.length}
        officeCount={offices.length}
        people={people}
        offices={offices}
      />
      <PartnersSection people={people} locale={locale} />
      <PracticeAreasSection services={services} locale={locale} />
      <SectorsSection industries={industries} locale={locale} />
      <InsightsSection insights={insights} locale={locale} />
      <ContactSection
        offices={offices}
        email={settings?.email}
        phone={settings?.phone}
        locale={locale}
      />
    </>
  );
}
