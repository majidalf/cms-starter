import { notFound } from 'next/navigation';
import { getDictionary, isLocale, localePath } from '@/lib/i18n';
import { listPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import { getIndustries } from '@/lib/sanity/collections/industry';
import { EntryList } from '@/components/collections/EntryList';
import { PageHeader } from '@/components/collections/PageHeader';
import { industryEntries } from '@/components/collections/entries';
import { Container } from '@/components/ui/Container';

export function generateMetadata({ params }: PageProps<'/[locale]/industries'>) {
  return listPageMetadata(params, routes.industries, (t) => t.industries);
}

export default async function IndustriesPage({ params }: PageProps<'/[locale]/industries'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const industries = await getIndustries();

  return (
    <div className="bg-navy-950 text-on-navy">
      <PageHeader
        locale={locale}
        path={localePath(locale, routes.industries)}
        title={t.industries}
      />
      <Container className="pb-20">
        <EntryList entries={industryEntries(industries, locale)} emptyText={t.emptyList} />
      </Container>
    </div>
  );
}
