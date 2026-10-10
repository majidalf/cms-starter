import { notFound } from 'next/navigation';
import { getDictionary, isLocale, localePath } from '@/lib/i18n';
import { listPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import { getCaseStudies } from '@/lib/sanity/collections/caseStudy';
import { EntryList } from '@/components/collections/EntryList';
import { PageHeader } from '@/components/collections/PageHeader';
import { caseStudyEntries } from '@/components/collections/entries';
import { Container } from '@/components/ui/Container';

export function generateMetadata({ params }: PageProps<'/[locale]/case-studies'>) {
  return listPageMetadata(params, routes.caseStudies, (t) => t.caseStudies);
}

export default async function CaseStudiesPage({ params }: PageProps<'/[locale]/case-studies'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const caseStudies = await getCaseStudies();

  return (
    <div className="bg-navy-950 text-on-navy">
      <PageHeader
        locale={locale}
        path={localePath(locale, routes.caseStudies)}
        title={t.caseStudies}
      />
      <Container className="pb-20">
        <EntryList entries={caseStudyEntries(caseStudies, locale)} emptyText={t.emptyList} />
      </Container>
    </div>
  );
}
