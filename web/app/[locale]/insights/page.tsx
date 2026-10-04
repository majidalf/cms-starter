import { notFound } from 'next/navigation';
import { getDictionary, isLocale } from '@/lib/i18n';
import { listPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import { getInsights } from '@/lib/sanity/collections/insight';
import { EntryList } from '@/components/collections/EntryList';
import { PageHeader } from '@/components/collections/PageHeader';
import { insightEntries } from '@/components/collections/entries';
import { Container } from '@/components/ui/Container';

export function generateMetadata({ params }: PageProps<'/[locale]/insights'>) {
  return listPageMetadata(params, routes.insights, (t) => t.insights);
}

export default async function InsightsPage({ params }: PageProps<'/[locale]/insights'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const insights = await getInsights();

  return (
    <>
      <PageHeader title={t.insights} />
      <Container className="pb-20">
        <EntryList entries={insightEntries(insights, locale)} emptyText={t.emptyList} />
      </Container>
    </>
  );
}
