import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { redirectToLocalizedSlug, slugParams } from '@/lib/collectionRoutes';
import { getDictionary, isLocale, localePath } from '@/lib/i18n';
import { detailPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import {
  getIndustryByAnySlug,
  getIndustryBySlug,
  getIndustrySlugs,
} from '@/lib/sanity/collections/industry';
import { localize } from '@/lib/sanity/localize';
import { EntryList } from '@/components/collections/EntryList';
import { PageHeader } from '@/components/collections/PageHeader';
import { RelatedBlock } from '@/components/collections/RelatedBlock';
import { RichText } from '@/components/collections/RichText';
import { caseStudyEntries, serviceEntries } from '@/components/collections/entries';

const BASE = routes.industries;

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  return slugParams(await getIndustrySlugs(), params.locale);
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/industries/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const industry = await getIndustryBySlug(locale, slug);
  return detailPageMetadata(
    locale,
    BASE,
    industry && {
      slug: industry.slug,
      seo: industry.seo,
      title: localize(industry.title, locale),
      description: localize(industry.summary, locale),
    },
  );
}

export default async function IndustryPage({ params }: PageProps<'/[locale]/industries/[slug]'>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const industry = await getIndustryBySlug(locale, slug);
  if (!industry) return redirectToLocalizedSlug(locale, slug, BASE, getIndustryByAnySlug);

  const t = getDictionary(locale);
  const services = serviceEntries(industry.services, locale);
  const caseStudies = caseStudyEntries(industry.caseStudies, locale);

  return (
    <article className="pb-16">
      <PageHeader
        title={localize(industry.title, locale) ?? ''}
        intro={localize(industry.summary, locale)}
        back={{ href: localePath(locale, BASE), label: t.industries }}
      />
      <RichText value={localize(industry.body, locale)} />
      <RelatedBlock title={t.relatedServices} isEmpty={services.length === 0}>
        <EntryList entries={services} headingLevel="h3" />
      </RelatedBlock>
      <RelatedBlock title={t.relatedCaseStudies} isEmpty={caseStudies.length === 0}>
        <EntryList entries={caseStudies} headingLevel="h3" />
      </RelatedBlock>
    </article>
  );
}
