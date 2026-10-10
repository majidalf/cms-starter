import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { listPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import { getPeople } from '@/lib/sanity/collections/person';
import { HeaderSpacer } from '@/components/layout/HeaderSpacer';
import { PartnersPanel } from '@/components/partners/PartnersPanel';

export function generateMetadata({ params }: PageProps<'/[locale]/partners'>): Promise<Metadata> {
  return listPageMetadata(params, routes.leadership, (t) => t.leadership);
}

/**
 * Partners index. Design.pen has no frame for this page (the nav links to it), so it shows
 * the designed partners panel on its own, with the panel title as the page <h1>.
 */
export default async function PartnersPage({ params }: PageProps<'/[locale]/partners'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const people = await getPeople();

  return (
    <>
      <HeaderSpacer />
      <div aria-hidden="true" className="h-2 lg:h-5" />
      <PartnersPanel people={people} locale={locale} inset="page" headingLevel="h1" />
      <div aria-hidden="true" className="h-11 lg:h-[60px]" />
    </>
  );
}
