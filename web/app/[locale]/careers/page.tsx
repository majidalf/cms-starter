import { notFound } from 'next/navigation';
import { getDictionary, isLocale } from '@/lib/i18n';
import { listPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import { getJobOpenings } from '@/lib/sanity/collections/jobOpening';
import { EntryList } from '@/components/collections/EntryList';
import { PageHeader } from '@/components/collections/PageHeader';
import { jobOpeningEntries } from '@/components/collections/entries';
import { Container } from '@/components/ui/Container';

export function generateMetadata({ params }: PageProps<'/[locale]/careers'>) {
  return listPageMetadata(params, routes.careers, (t) => t.careers);
}

export default async function CareersPage({ params }: PageProps<'/[locale]/careers'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const openings = await getJobOpenings();

  return (
    <>
      <PageHeader title={t.careers} />
      <Container className="pb-20">
        <EntryList entries={jobOpeningEntries(openings, locale)} emptyText={t.noOpenings} />
      </Container>
    </>
  );
}
