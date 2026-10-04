import { notFound } from 'next/navigation';
import { getDictionary, isLocale } from '@/lib/i18n';
import { listPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import { getServices } from '@/lib/sanity/collections/service';
import { EntryList } from '@/components/collections/EntryList';
import { PageHeader } from '@/components/collections/PageHeader';
import { serviceEntries } from '@/components/collections/entries';
import { Container } from '@/components/ui/Container';

export function generateMetadata({ params }: PageProps<'/[locale]/services'>) {
  return listPageMetadata(params, routes.services, (t) => t.services);
}

export default async function ServicesPage({ params }: PageProps<'/[locale]/services'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const services = await getServices();

  return (
    <>
      <PageHeader title={t.services} />
      <Container className="pb-20">
        <EntryList entries={serviceEntries(services, locale)} emptyText={t.emptyList} />
      </Container>
    </>
  );
}
