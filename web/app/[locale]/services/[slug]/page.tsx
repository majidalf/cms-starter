import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { redirectToLocalizedSlug, slugParams } from '@/lib/collectionRoutes';
import { getDictionary, isLocale, localePath } from '@/lib/i18n';
import { detailPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import {
  getServiceByAnySlug,
  getServiceBySlug,
  getServiceSlugs,
} from '@/lib/sanity/collections/service';
import { localize } from '@/lib/sanity/localize';
import { EntryList } from '@/components/collections/EntryList';
import { PageHeader } from '@/components/collections/PageHeader';
import { PersonList } from '@/components/collections/PersonList';
import { RelatedBlock } from '@/components/collections/RelatedBlock';
import { RichText } from '@/components/collections/RichText';
import {
  caseStudyEntries,
  industryEntries,
  insightEntries,
} from '@/components/collections/entries';

const BASE = routes.services;

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  return slugParams(await getServiceSlugs(), params.locale);
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/services/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const service = await getServiceBySlug(locale, slug);
  return detailPageMetadata(
    locale,
    BASE,
    service && {
      slug: service.slug,
      seo: service.seo,
      title: localize(service.title, locale),
      description: localize(service.summary, locale),
    },
  );
}

export default async function ServicePage({ params }: PageProps<'/[locale]/services/[slug]'>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const service = await getServiceBySlug(locale, slug);
  if (!service) return redirectToLocalizedSlug(locale, slug, BASE, getServiceByAnySlug);

  const t = getDictionary(locale);
  const industries = industryEntries(service.industries ?? [], locale);
  const caseStudies = caseStudyEntries(service.caseStudies, locale);
  const insights = insightEntries(service.insights, locale);

  return (
    <article className="pb-16">
      <PageHeader
        title={localize(service.title, locale) ?? ''}
        intro={localize(service.summary, locale)}
        back={{ href: localePath(locale, BASE), label: t.services }}
      />
      <RichText value={localize(service.body, locale)} />
      <RelatedBlock title={t.keyContacts} isEmpty={!service.keyContacts?.length}>
        <PersonList people={service.keyContacts ?? []} locale={locale} />
      </RelatedBlock>
      <RelatedBlock title={t.relatedIndustries} isEmpty={industries.length === 0}>
        <EntryList entries={industries} headingLevel="h3" />
      </RelatedBlock>
      <RelatedBlock title={t.relatedCaseStudies} isEmpty={caseStudies.length === 0}>
        <EntryList entries={caseStudies} headingLevel="h3" />
      </RelatedBlock>
      <RelatedBlock title={t.latestInsights} isEmpty={insights.length === 0}>
        <EntryList entries={insights} headingLevel="h3" />
      </RelatedBlock>
    </article>
  );
}
