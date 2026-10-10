import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { detailPath } from '@/lib/collectionRoutes';
import { getDictionary, isLocale, localePath } from '@/lib/i18n';
import { listPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import { getCaseStudies } from '@/lib/sanity/collections/caseStudy';
import { localize } from '@/lib/sanity/localize';
import { MatterList, type MatterRow } from '@/components/insights/MatterList';
import { PageHeader } from '@/components/sections/PageHeader';
import { DesignNote } from '@/components/ui/DesignNote';

export function generateMetadata({ params }: PageProps<'/[locale]/experience'>): Promise<Metadata> {
  return listPageMetadata(params, routes.caseStudies, (t) => t.caseStudies);
}

/**
 * Experience (Design.pen → Experience · Desktop 1440 / Mobile 375): selected matters,
 * filtered by practice area, sector and year. Only entries with the client's written
 * consent are queried, and the page does not exist until there is at least one.
 */
export default async function ExperiencePage({ params }: PageProps<'/[locale]/experience'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const caseStudies = await getCaseStudies();
  const t = getDictionary(locale);
  const page = t.experience;
  const rows: MatterRow[] = caseStudies.flatMap((matter) => {
    const href = detailPath(locale, routes.caseStudies, matter.slug);
    const title = localize(matter.title, locale);
    if (!href || !title) return [];
    return [
      {
        id: matter._id,
        href,
        title,
        year: matter.year ?? undefined,
        practiceArea: localize(matter.service?.title, locale),
        sector: localize(matter.industry?.title, locale),
      },
    ];
  });
  if (rows.length === 0) notFound();

  return (
    <>
      <PageHeader
        breadcrumbLabel={t.breadcrumb}
        breadcrumb={[{ label: t.homeLabel, href: localePath(locale) }, { label: t.caseStudies }]}
        label={page.label}
        title={page.heading}
        lead={page.lead}
        spacing="pb-8 lg:pb-16"
      />
      <MatterList
        rows={rows}
        labels={{
          filter: page.filter,
          practiceArea: page.practiceArea,
          sector: page.sector,
          year: page.year,
          all: page.all,
          emptyFiltered: page.emptyFiltered,
        }}
      />
      <div className="relative mx-auto w-full max-w-[1440px] px-4 lg:pl-[calc((100%-40px)/3+20px)] lg:pr-5">
        <DesignNote className="max-w-[700px] text-[14px] leading-[21px] lg:text-[13px] lg:leading-[15px]">
          {page.draftNote}
        </DesignNote>
      </div>
      <div aria-hidden="true" className="h-14 lg:h-28" />
    </>
  );
}
