import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary, isLocale, localePath } from '@/lib/i18n';
import { listPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import { getIndustries } from '@/lib/sanity/collections/industry';
import { getSiteSettings } from '@/lib/sanity/queries';
import { CtaPanel } from '@/components/sections/CtaPanel';
import { LabeledSection } from '@/components/sections/LabeledSection';
import { PageHeader } from '@/components/sections/PageHeader';
import { SectorGrid } from '@/components/sections/SectorGrid';

export function generateMetadata({ params }: PageProps<'/[locale]/sectors'>): Promise<Metadata> {
  return listPageMetadata(params, routes.industries, (t) => t.industries);
}

/**
 * Sectors. Design.pen has no frame for this page (the footer links to it), so it is composed
 * from designed parts: the inner page header, the sector grid from the home page and the
 * CTA panel. Sectors are names only - there is no page per sector.
 */
export default async function SectorsPage({ params }: PageProps<'/[locale]/sectors'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [industries, settings] = await Promise.all([getIndustries(), getSiteSettings()]);
  const t = getDictionary(locale);

  return (
    <>
      <PageHeader
        breadcrumbLabel={t.breadcrumb}
        breadcrumb={[{ label: t.homeLabel, href: localePath(locale) }, { label: t.industries }]}
        label={t.home.sectorsLabel}
        title={t.home.sectorsHeading}
        lead={t.sectorsPage.lead}
      />
      <LabeledSection label={t.industries} spacing="pb-14 lg:pb-28" isSolid>
        <SectorGrid industries={industries} locale={locale} />
      </LabeledSection>
      <CtaPanel
        heading={t.about.ctaHeading}
        lead={t.about.ctaLead}
        cta={{ label: t.bookConsultation, href: localePath(locale, routes.contact) }}
        direct={[settings?.phone, settings?.email].filter(Boolean).join(' · ')}
      />
      <div aria-hidden="true" className="h-14 lg:h-20" />
    </>
  );
}
