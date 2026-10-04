import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { detailPath, redirectToLocalizedSlug, slugParams } from '@/lib/collectionRoutes';
import { formatDate, getDictionary, isLocale, localePath } from '@/lib/i18n';
import { safeHref } from '@/lib/links';
import { detailPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import {
  getInsightByAnySlug,
  getInsightBySlug,
  getInsightSlugs,
} from '@/lib/sanity/collections/insight';
import { localize } from '@/lib/sanity/localize';
import { EntryList } from '@/components/collections/EntryList';
import { PageHeader } from '@/components/collections/PageHeader';
import { RelatedBlock } from '@/components/collections/RelatedBlock';
import { RichText } from '@/components/collections/RichText';
import { serviceEntries } from '@/components/collections/entries';
import { Container } from '@/components/ui/Container';

const BASE = routes.insights;

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  return slugParams(await getInsightSlugs(), params.locale);
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/insights/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const insight = await getInsightBySlug(locale, slug);
  return detailPageMetadata(
    locale,
    BASE,
    insight && {
      slug: insight.slug,
      seo: insight.seo,
      title: localize(insight.title, locale),
      description: localize(insight.excerpt, locale),
    },
  );
}

export default async function InsightPage({ params }: PageProps<'/[locale]/insights/[slug]'>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const insight = await getInsightBySlug(locale, slug);
  if (!insight) return redirectToLocalizedSlug(locale, slug, BASE, getInsightByAnySlug);

  const t = getDictionary(locale);
  const category = insight.category ? t.insightCategories[insight.category] : undefined;
  const date = formatDate(insight.publishedAt, locale);
  const attachmentUrl = safeHref(insight.attachmentUrl);
  const services = serviceEntries(insight.services ?? [], locale);
  const authors = (insight.authors ?? []).flatMap((author) => {
    const href = detailPath(locale, routes.leadership, author.slug);
    return href && author.name ? [{ key: author._id, href, name: author.name }] : [];
  });

  return (
    <article className="pb-16">
      <PageHeader
        title={localize(insight.title, locale) ?? ''}
        eyebrow={[category, date].filter(Boolean).join(' · ')}
        intro={localize(insight.excerpt, locale)}
        back={{ href: localePath(locale, BASE), label: t.insights }}
      >
        {authors.length > 0 && (
          <p className="text-sm">
            <span className="text-muted">{t.authors}: </span>
            {authors.map((author, index) => (
              <span key={author.key}>
                {index > 0 && ', '}
                <Link href={author.href} className="underline underline-offset-2">
                  {author.name}
                </Link>
              </span>
            ))}
          </p>
        )}
      </PageHeader>
      <RichText value={localize(insight.body, locale)} />
      {attachmentUrl && (
        <Container className="py-6">
          <a
            href={`${attachmentUrl}?dl=`}
            className="inline-flex items-center border border-current px-5 py-3 text-sm font-medium text-brand hover:bg-brand hover:text-surface"
          >
            {t.downloadPdf}
          </a>
        </Container>
      )}
      <RelatedBlock title={t.relatedServices} isEmpty={services.length === 0}>
        <EntryList entries={services} headingLevel="h3" />
      </RelatedBlock>
    </article>
  );
}
