import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary, isLocale, localePath, pathsForAllLocales } from '@/lib/i18n';
import { websiteJsonLd } from '@/lib/jsonLd';
import { resolveLinks } from '@/lib/links';
import { getIndustries } from '@/lib/sanity/collections/industry';
import { getInsights } from '@/lib/sanity/collections/insight';
import { getOffices } from '@/lib/sanity/collections/office';
import { getPeople } from '@/lib/sanity/collections/person';
import { getServicePanels } from '@/lib/sanity/collections/service';
import { localize, localizeList } from '@/lib/sanity/localize';
import { getHomePage, getSiteSettings } from '@/lib/sanity/queries';
import { buildMetadata } from '@/lib/seo';
import { absoluteUrl, siteUrl } from '@/lib/site';
import { ContactPanel } from '@/components/contact/ContactPanel';
import { HomeInsights } from '@/components/insights/InsightCards';
import { JsonLd } from '@/components/JsonLd';
import { PartnersPanel } from '@/components/partners/PartnersPanel';
import { PracticeAreasSection } from '@/components/practice/PracticeAreasSection';
import { Facts } from '@/components/sections/Facts';
import { HomeAbout } from '@/components/sections/HomeAbout';
import { HomeHero } from '@/components/sections/HomeHero';
import { LabeledSection } from '@/components/sections/LabeledSection';
import { SectorGrid } from '@/components/sections/SectorGrid';

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

/**
 * Home (Design.pen → Home · Desktop 1440 / Home · Mobile 375): Hero, About, Partners,
 * Practice Areas, Sectors, Insights, Contact. The hero comes from the home page document in
 * Sanity; every list is counted and filled from its collection.
 */
export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [page, settings, services, industries, insights, people, offices] = await Promise.all([
    getHomePage(),
    getSiteSettings(),
    getServicePanels(),
    getIndustries(),
    getInsights(),
    getPeople(),
    getOffices(),
  ]);
  if (!page) {
    throw new Error('No home page. Choose one under "Site settings → Home page" in Studio.');
  }
  const t = getDictionary(locale);
  const hero = page.sections?.find((section) => section._type === 'heroSection');
  const [primaryCta, secondaryCta] = resolveLinks(hero?.ctas, locale);
  const structuredData = websiteJsonLd({
    name: settings?.organizationName ?? '',
    url: absoluteUrl(localePath(locale)),
    language: locale,
    organizationUrl: siteUrl.origin,
  });

  return (
    <>
      <JsonLd data={structuredData} />
      {hero && (
        <HomeHero
          locale={locale}
          eyebrow={t.home.heroEyebrow}
          heading={localize(hero.heading, locale) ?? ''}
          subheading={localize(hero.subheading, locale)}
          image={hero.image}
          primaryCta={primaryCta}
          secondaryCta={secondaryCta}
        />
      )}
      <HomeAbout
        label={t.home.aboutLabel}
        statement={t.home.aboutStatement}
        paragraphs={[t.home.aboutP1, t.home.aboutP2]}
      >
        <Facts
          locale={locale}
          practiceAreaCount={services.length}
          partnerNames={people.flatMap((person) => (person.name ? [person.name] : []))}
          officeCount={offices.length}
          sectorCount={industries.length}
        />
      </HomeAbout>
      <PartnersPanel people={people} locale={locale} id="partners" />
      <PracticeAreasSection services={services} locale={locale} />
      {industries.length > 0 && (
        <LabeledSection
          id="sectors"
          inset="home"
          label={t.home.sectorsLabel}
          heading={t.home.sectorsHeading}
          spacing="py-[72px] lg:py-[120px]"
          isSolid
        >
          <SectorGrid industries={industries} locale={locale} />
        </LabeledSection>
      )}
      <HomeInsights insights={insights} locale={locale} />
      <ContactPanel
        locale={locale}
        email={settings?.email}
        phone={settings?.phone}
        offices={offices}
        practiceAreas={localizeList(
          services.map((service) => service.title),
          locale,
        )}
      />
    </>
  );
}
