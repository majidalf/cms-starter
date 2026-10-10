import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary, isLocale, localePath } from '@/lib/i18n';
import { listPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import { getServicePanels } from '@/lib/sanity/collections/service';
import { getSiteSettings } from '@/lib/sanity/queries';
import { PracticeAreasSection } from '@/components/practice/PracticeAreasSection';
import { CtaPanel } from '@/components/sections/CtaPanel';
import { PageHeader } from '@/components/sections/PageHeader';

export function generateMetadata({
  params,
}: PageProps<'/[locale]/practice-areas'>): Promise<Metadata> {
  return listPageMetadata(params, routes.services, (t) => t.services);
}

/**
 * Practice areas index. Design.pen has no frame for this page (the nav links to it), so it
 * is composed from designed parts only: the inner page header, the index + detail panel
 * from the home page, and the CTA panel.
 */
export default async function PracticeAreasPage({ params }: PageProps<'/[locale]/practice-areas'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [services, settings] = await Promise.all([getServicePanels(), getSiteSettings()]);
  const t = getDictionary(locale);

  return (
    <>
      <PageHeader
        breadcrumbLabel={t.breadcrumb}
        breadcrumb={[{ label: t.homeLabel, href: localePath(locale) }, { label: t.services }]}
        label={t.home.practiceLabel}
        title={t.practice.indexHeading}
        lead={t.home.practiceLead}
        spacing="pb-10 lg:pb-16"
      />
      <PracticeAreasSection services={services} locale={locale} showHead={false} />
      <div aria-hidden="true" className="h-3 lg:h-5" />
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
