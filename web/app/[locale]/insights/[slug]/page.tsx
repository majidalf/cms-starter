import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { detailPath, redirectToLocalizedSlug, slugParams } from '@/lib/collectionRoutes';
import { formatDate, getDictionary, isLocale, localePath } from '@/lib/i18n';
import { articleJsonLd } from '@/lib/jsonLd';
import { safeHref } from '@/lib/links';
import { detailPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import {
  getInsightByAnySlug,
  getInsightBySlug,
  getInsightSlugs,
  getInsights,
} from '@/lib/sanity/collections/insight';
import { localize } from '@/lib/sanity/localize';
import { EntryList } from '@/components/collections/EntryList';
import { PageHeader } from '@/components/collections/PageHeader';
import { RelatedBlock } from '@/components/collections/RelatedBlock';
import { RichText } from '@/components/collections/RichText';
import { serviceEntries } from '@/components/collections/entries';
import { Container } from '@/components/ui/Container';
import { JsonLd } from '@/components/JsonLd';
import { absoluteUrl, siteUrl } from '@/lib/site';

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

/**
 * Insight article (design/Design.pen -> Insights Article · Desktop 1440):
 * date + author eyebrow, display H1, comfortable-measure body, disclaimer
 * note, author card, related practice areas and previous/next links.
 */
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
  const authorNames = authors.map((author) => author.name).join(', ');
  const eyebrow = [category, date, authorNames ? `${t.by} ${authorNames}` : undefined]
    .filter(Boolean)
    .join(' · ');

  const structuredData = articleJsonLd({
    headline: localize(insight.title, locale) ?? '',
    url: absoluteUrl(localePath(locale, `${BASE}/${slug}`)),
    datePublished: insight.publishedAt,
    description: localize(insight.excerpt, locale),
    language: locale,
    authors: authors.map((author) => ({ name: author.name, url: absoluteUrl(author.href) })),
    organizationUrl: siteUrl.origin,
  });

  // Previous (newer) and next (older) in publication order.
  const all = await getInsights();
  const position = all.findIndex((item) => item._id === insight._id);
  const neighbor = (offset: number) => {
    const item = position >= 0 ? all[position + offset] : undefined;
    const title = item ? localize(item.title, locale) : undefined;
    const href = item ? detailPath(locale, BASE, item.slug) : undefined;
    return title && href ? { title, href } : undefined;
  };
  const previous = neighbor(-1);
  const next = neighbor(1);

  return (
    <div className="bg-navy-950 text-on-navy">
      <article className="pb-8">
        <JsonLd data={structuredData} />
        <PageHeader
          locale={locale}
          path={localePath(locale, `${BASE}/${slug}`)}
          title={localize(insight.title, locale) ?? ''}
          eyebrow={eyebrow || category}
          intro={localize(insight.excerpt, locale)}
          back={{ href: localePath(locale, BASE), label: t.insights }}
        >
          {authors.length > 0 && (
            <p className="text-sm text-on-navy-2">
              <span>{t.authors}: </span>
              {authors.map((author, index) => (
                <span key={author.key}>
                  {index > 0 && ', '}
                  <Link
                    href={author.href}
                    className="text-on-navy underline underline-offset-2 hover:text-brass-light"
                  >
                    {author.name}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </PageHeader>
        <RichText value={localize(insight.body, locale)} />
        <Container className="max-w-3xl py-2">
          <p className="border-t border-on-navy/15 pt-6 text-sm leading-relaxed text-on-navy-2">
            {t.article.disclaimer}
          </p>
        </Container>
        {attachmentUrl && (
          <Container className="max-w-3xl py-6">
            <a
              href={`${attachmentUrl}?dl=`}
              className="inline-flex items-center gap-3 rounded-xs bg-paper px-6 py-4 text-base font-medium text-navy-900 transition-colors hover:bg-brass-light focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
            >
              {t.downloadPdf}
            </a>
          </Container>
        )}
        <RelatedBlock title={t.article.relatedAreas} isEmpty={services.length === 0}>
          <EntryList entries={services} headingLevel="h3" />
        </RelatedBlock>
        {(previous || next) && (
          <Container className="flex flex-wrap items-center justify-between gap-4 py-10">
            {previous ? (
              <Link
                href={previous.href}
                className="inline-flex items-center gap-2 text-on-navy-2 transition-colors hover:text-brass-light"
              >
                <span aria-hidden="true">←</span> {t.previous}: {previous.title}
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={next.href}
                className="inline-flex items-center gap-2 text-on-navy-2 transition-colors hover:text-brass-light"
              >
                {t.next}: {next.title} <span aria-hidden="true">→</span>
              </Link>
            )}
          </Container>
        )}
      </article>
    </div>
  );
}
