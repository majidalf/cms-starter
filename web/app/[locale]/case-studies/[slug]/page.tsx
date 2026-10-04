import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { redirectToLocalizedSlug, slugParams } from '@/lib/collectionRoutes';
import { getDictionary, isLocale, localePath } from '@/lib/i18n';
import { detailPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import {
  getCaseStudyByAnySlug,
  getCaseStudyBySlug,
  getCaseStudySlugs,
} from '@/lib/sanity/collections/caseStudy';
import { localize } from '@/lib/sanity/localize';
import { EntryList } from '@/components/collections/EntryList';
import { PageHeader } from '@/components/collections/PageHeader';
import { RelatedBlock } from '@/components/collections/RelatedBlock';
import { RichText } from '@/components/collections/RichText';
import { industryEntries, serviceEntries } from '@/components/collections/entries';

const BASE = routes.caseStudies;

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  return slugParams(await getCaseStudySlugs(), params.locale);
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/case-studies/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const caseStudy = await getCaseStudyBySlug(locale, slug);
  return detailPageMetadata(
    locale,
    BASE,
    caseStudy && {
      slug: caseStudy.slug,
      seo: caseStudy.seo,
      title: localize(caseStudy.title, locale),
      description: localize(caseStudy.summary, locale),
    },
  );
}

export default async function CaseStudyPage({
  params,
}: PageProps<'/[locale]/case-studies/[slug]'>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const caseStudy = await getCaseStudyBySlug(locale, slug);
  if (!caseStudy) return redirectToLocalizedSlug(locale, slug, BASE, getCaseStudyByAnySlug);

  const t = getDictionary(locale);
  const services = serviceEntries(caseStudy.services ?? [], locale);
  const industries = industryEntries(caseStudy.industries ?? [], locale);

  return (
    <article className="pb-16">
      <PageHeader
        title={localize(caseStudy.title, locale) ?? ''}
        intro={localize(caseStudy.summary, locale)}
        back={{ href: localePath(locale, BASE), label: t.caseStudies }}
      >
        <dl className="flex flex-wrap gap-x-10 gap-y-2 text-sm">
          <div>
            <dt className="text-muted">{t.client}</dt>
            <dd>{localize(caseStudy.client, locale)}</dd>
          </div>
          <div>
            <dt className="text-muted">{t.year}</dt>
            <dd>{caseStudy.year}</dd>
          </div>
        </dl>
      </PageHeader>
      <RichText heading={t.challenge} value={localize(caseStudy.challenge, locale)} />
      <RichText heading={t.approach} value={localize(caseStudy.approach, locale)} />
      <RichText heading={t.outcome} value={localize(caseStudy.outcome, locale)} />
      <RelatedBlock title={t.relatedServices} isEmpty={services.length === 0}>
        <EntryList entries={services} headingLevel="h3" />
      </RelatedBlock>
      <RelatedBlock title={t.relatedIndustries} isEmpty={industries.length === 0}>
        <EntryList entries={industries} headingLevel="h3" />
      </RelatedBlock>
    </article>
  );
}
