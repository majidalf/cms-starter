import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { detailPath, redirectToLocalizedSlug, slugParams } from '@/lib/collectionRoutes';
import { fill, formatShortDate, getDictionary, isLocale, localePath } from '@/lib/i18n';
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
import { absoluteUrl, siteUrl } from '@/lib/site';
import { PrintButton } from '@/components/insights/PrintButton';
import { JsonLd } from '@/components/JsonLd';
import { PartnerRowCard } from '@/components/partners/PartnerRowCard';
import { headingsOf, PortableTextRenderer } from '@/components/PortableTextRenderer';
import { PageHeader } from '@/components/sections/PageHeader';
import { DesignNote } from '@/components/ui/DesignNote';
import { TagPill } from '@/components/ui/Pill';
import { UnderlineLink } from '@/components/ui/UnderlineLink';

const BASE = routes.insights;
const INDENT = 'lg:pl-[calc((100%-40px)/3+20px)]';

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
 * Article (Design.pen → Insights Article · Desktop 1440 / Mobile 375): category, date and
 * byline beside the title; "In this article" and the tools in the first third while the
 * text runs at 720px; then the disclaimer, the author card, related practice areas and the
 * previous / next articles.
 */
export default async function InsightPage({ params }: PageProps<'/[locale]/insights/[slug]'>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [insight, all] = await Promise.all([getInsightBySlug(locale, slug), getInsights()]);
  if (!insight) return redirectToLocalizedSlug(locale, slug, BASE, getInsightByAnySlug);

  const t = getDictionary(locale);
  const title = localize(insight.title, locale) ?? '';
  const category = insight.category
    ? (t.insightCategories[insight.category] ?? insight.category)
    : undefined;
  const authors = insight.authors ?? [];
  const authorNames = authors.flatMap((author) => (author.name ? [author.name] : []));
  const body = localize(insight.body, locale);
  const headings = headingsOf(body);
  const attachmentUrl = safeHref(insight.attachmentUrl);
  const path = detailPath(locale, BASE, insight.slug) ?? localePath(locale, BASE);
  const related = (insight.services ?? []).flatMap((service) => {
    const label = localize(service.title, locale);
    const href = detailPath(locale, routes.services, service.slug);
    return label && href ? [{ id: service._id, label, href }] : [];
  });
  // The list is newest first: "previous" is the newer neighbour, "next" the older one.
  const position = all.findIndex((item) => item._id === insight._id);
  const neighbour = (offset: number) => {
    const item = position < 0 ? undefined : all[position + offset];
    const href = item && detailPath(locale, BASE, item.slug);
    const label = item && localize(item.title, locale);
    return href && label ? { href, label } : undefined;
  };
  const previous = neighbour(-1);
  const next = neighbour(1);

  const tools = (
    <>
      {attachmentUrl && (
        <UnderlineLink href={attachmentUrl} size="touch" icon="download" external>
          {t.article.downloadPdf}
        </UnderlineLink>
      )}
      <PrintButton>
        <span className="lg:hidden">{t.article.printShort}</span>
        <span className="hidden lg:inline">{t.article.print}</span>
      </PrintButton>
    </>
  );
  const contents = (
    <ol className="flex flex-col">
      {headings.map((heading) => (
        <li key={heading.id} className="border-line-navy not-first:border-t">
          <a
            href={`#${heading.id}`}
            className="block py-3 text-[16px] leading-[19px] text-on-navy transition-colors hover:text-brass-light"
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          headline: title,
          url: absoluteUrl(path),
          datePublished: insight.publishedAt,
          description: localize(insight.excerpt, locale),
          language: locale,
          authors: authors.flatMap((author) => {
            const href = detailPath(locale, routes.leadership, author.slug);
            return author.name && href ? [{ name: author.name, url: absoluteUrl(href) }] : [];
          }),
          organizationUrl: siteUrl.origin,
        })}
      />
      <PageHeader
        breadcrumbLabel={t.breadcrumb}
        breadcrumb={[
          { label: t.insights, href: localePath(locale, BASE) },
          { label: category ?? title },
        ]}
        label={
          <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-start lg:pr-10 lg:pt-2">
            {category && (
              <TagPill className="max-lg:text-[14px] max-lg:leading-[17px]">{category}</TagPill>
            )}
            <time dateTime={insight.publishedAt ?? undefined}>
              {formatShortDate(insight.publishedAt, locale)}
            </time>
            {authorNames.length > 0 && (
              <span className="max-lg:w-full lg:text-on-navy">
                {fill(t.article.by, { name: authorNames.join(', ') })}
              </span>
            )}
          </div>
        }
        title={title}
        titleSize="sm"
        spacing="pb-8 lg:pb-[72px]"
      />
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col px-4 pb-10 lg:flex-row lg:items-start lg:px-5 lg:pb-24">
        <aside className="flex flex-col pb-6 lg:sticky lg:top-28 lg:w-1/3 lg:shrink-0 lg:gap-7 lg:pb-0 lg:pr-10">
          {headings.length > 0 && (
            <>
              <nav aria-label={t.article.inThisArticle} className="hidden flex-col lg:flex">
                <p className="pb-0 text-[13px] leading-[15px] text-on-navy-2">
                  {t.article.inThisArticle}
                </p>
                {contents}
              </nav>
              <details className="group border-y border-line-navy lg:hidden">
                <summary className="flex h-[55px] cursor-pointer list-none items-center justify-between text-[16px] text-on-navy -outline-offset-2 [&::-webkit-details-marker]:hidden">
                  {t.article.inThisArticle}
                  <span aria-hidden="true" className="text-[20px] text-on-navy-2 group-open:hidden">
                    +
                  </span>
                  <span
                    aria-hidden="true"
                    className="hidden text-[20px] text-on-navy-2 group-open:inline"
                  >
                    −
                  </span>
                </summary>
                <nav aria-label={t.article.inThisArticle} className="pb-2">
                  {contents}
                </nav>
              </details>
            </>
          )}
          <div className="flex gap-6 pt-2 lg:flex-col lg:gap-[14px] lg:pt-0">{tools}</div>
        </aside>
        <article className="flex w-full flex-col gap-6 lg:max-w-[720px] lg:gap-7">
          <PortableTextRenderer value={body} hasLead />
          <DesignNote className="text-[14px] leading-[24px]">{t.article.sampleNote}</DesignNote>
          <p className="border-t border-line-navy pt-5 text-[14px] leading-[21px] text-on-navy-2 lg:pt-6">
            {t.article.disclaimer}
          </p>
        </article>
      </div>
      {authors.length > 0 && (
        <div
          className={`relative mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-3 pb-10 lg:pb-24 lg:pr-5 ${INDENT}`}
        >
          {authors.map((author) => (
            <div key={author._id} className="flex lg:max-w-[720px]">
              <PartnerRowCard person={author} locale={locale} variant="author" />
            </div>
          ))}
        </div>
      )}
      {related.length > 0 && (
        <section className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 pb-10 lg:flex-row lg:gap-0 lg:px-5 lg:pb-24">
          <h2 className="text-[14px] leading-[17px] text-on-navy-2 lg:w-1/3 lg:shrink-0">
            {t.article.relatedAreas}
          </h2>
          <ul className="flex flex-col gap-2 lg:flex-row lg:flex-wrap">
            {related.map((item) => (
              <li key={item.id} className="flex">
                <Link href={item.href} className="group flex rounded-full">
                  <TagPill size="md" className="transition-colors group-hover:text-brass-light">
                    {item.label}
                  </TagPill>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      {(previous || next) && (
        <nav
          aria-label={t.insights}
          className="relative mx-auto flex w-full max-w-[1440px] flex-col px-4 lg:flex-row lg:justify-between lg:gap-10 lg:border-t lg:border-line-navy lg:px-5 lg:pb-24 lg:pt-7"
        >
          {previous ? (
            <Link
              href={previous.href}
              className="group flex flex-col gap-[6px] border-t border-line-navy py-5 lg:block lg:border-0 lg:py-0 lg:text-[16px] lg:leading-[19px] lg:text-on-navy-2"
            >
              <span className="text-[14px] leading-[17px] text-on-navy-2 lg:text-[16px]">
                <span aria-hidden="true" className="hidden lg:inline">
                  ←{' '}
                </span>
                {t.article.previous}{' '}
              </span>
              <span className="font-serif text-[18px] leading-[22px] text-on-navy transition-colors group-hover:text-brass-light lg:font-sans lg:text-[16px] lg:leading-[19px] lg:text-on-navy-2">
                {previous.label}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={next.href}
              className="group flex flex-col gap-[6px] border-y border-line-navy py-5 lg:block lg:border-0 lg:py-0 lg:text-right lg:text-[16px] lg:leading-[19px]"
            >
              <span className="text-[14px] leading-[17px] text-on-navy-2 lg:text-[16px] lg:text-on-navy">
                {t.article.next}{' '}
              </span>
              <span className="font-serif text-[18px] leading-[22px] text-on-navy transition-colors group-hover:text-brass-light lg:font-sans lg:text-[16px] lg:leading-[19px]">
                {next.label}
                <span aria-hidden="true" className="hidden lg:inline">
                  {' '}
                  →
                </span>
              </span>
            </Link>
          )}
        </nav>
      )}
      <div aria-hidden="true" className="h-14 lg:hidden" />
    </>
  );
}
