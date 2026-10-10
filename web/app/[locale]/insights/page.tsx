import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { detailPath } from '@/lib/collectionRoutes';
import { formatShortDate, getDictionary, isLocale, localePath } from '@/lib/i18n';
import { listPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import { getInsights } from '@/lib/sanity/collections/insight';
import { localize } from '@/lib/sanity/localize';
import { getSiteSettings } from '@/lib/sanity/queries';
import { InsightList, type InsightRow } from '@/components/insights/InsightList';
import { PageHeader } from '@/components/sections/PageHeader';
import { DesignNote } from '@/components/ui/DesignNote';
import { UnderlineLink } from '@/components/ui/UnderlineLink';

export function generateMetadata({ params }: PageProps<'/[locale]/insights'>): Promise<Metadata> {
  return listPageMetadata(params, routes.insights, (t) => t.insights);
}

/** The design's four chips, always offered. */
const CATEGORY_ORDER = ['article', 'update', 'news', 'publication'];
/** Still in the Studio list; offered only once an article uses it. */
const OPTIONAL_CATEGORIES = ['pressRelease'];
const INDENT = 'lg:pl-[calc((100%-40px)/3+20px)]';

/**
 * Insights (Design.pen → Insights · Desktop 1440 / Mobile 375, and Insights · Empty state):
 * header, category filter and the article list; with no articles, the empty state with two
 * links onward.
 */
export default async function InsightsPage({ params }: PageProps<'/[locale]/insights'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [insights, settings] = await Promise.all([getInsights(), getSiteSettings()]);
  const t = getDictionary(locale);
  const page = t.insightsPage;
  const rows: InsightRow[] = insights.flatMap((insight) => {
    const href = detailPath(locale, routes.insights, insight.slug);
    const title = localize(insight.title, locale);
    if (!href || !title) return [];
    const category = insight.category ?? '';
    return [
      {
        id: insight._id,
        href,
        title,
        date: formatShortDate(insight.publishedAt, locale),
        category,
        categoryLabel: t.insightCategories[category] ?? category,
        // Firm news has no byline; the firm is its author.
        author: insight.author ?? settings?.organizationName ?? undefined,
      },
    ];
  });
  const isEmpty = rows.length === 0;
  const used = new Set(rows.map((row) => row.category));
  const categories = [
    ...CATEGORY_ORDER,
    ...OPTIONAL_CATEGORIES.filter((value) => used.has(value)),
  ].map((value) => ({ value, label: t.insightCategories[value] ?? value }));

  return (
    <>
      <PageHeader
        breadcrumbLabel={t.breadcrumb}
        breadcrumb={[{ label: t.homeLabel, href: localePath(locale) }, { label: t.insights }]}
        label={page.label}
        title={page.heading}
        lead={isEmpty ? undefined : page.lead}
        spacing={isEmpty ? 'pb-10 lg:pb-16' : 'pb-8 lg:pb-16'}
      />
      {isEmpty ? (
        <section
          className={`relative mx-auto w-full max-w-[1440px] pb-24 lg:pb-28 lg:pr-5 ${INDENT}`}
        >
          <div className="flex flex-col gap-4 border-t border-line-navy px-4 pt-7 lg:gap-5 lg:px-0 lg:pt-10">
            <h2 className="font-display text-[32px] leading-[35px] tracking-[-0.4px] text-on-navy lg:text-[36px] lg:leading-[38px] lg:tracking-normal">
              {page.emptyTitle}
            </h2>
            <p className="text-[16px] leading-[24px] text-on-navy-2 lg:max-w-[600px] lg:text-[18px] lg:leading-[27px]">
              {page.emptyText}
            </p>
            <div className="flex flex-col lg:flex-row lg:gap-7 lg:pt-2">
              <UnderlineLink
                href={localePath(locale, routes.services)}
                size="touch"
                icon="arrowUpRight"
              >
                {page.seePracticeAreas}
              </UnderlineLink>
              <UnderlineLink
                href={localePath(locale, routes.leadership)}
                size="touch"
                icon="arrowUpRight"
              >
                {page.contactPartner}
              </UnderlineLink>
            </div>
          </div>
        </section>
      ) : (
        <>
          <InsightList
            rows={rows}
            categories={categories}
            labels={{
              filter: page.filter,
              all: page.all,
              loadMore: page.loadMore,
              emptyFiltered: page.emptyFiltered,
            }}
          />
          <div className={`relative mx-auto w-full max-w-[1440px] px-4 lg:pr-5 ${INDENT}`}>
            <DesignNote className="max-w-[700px] text-[14px] leading-[21px] lg:text-[13px] lg:leading-[15px]">
              {page.draftNote}
            </DesignNote>
          </div>
          <div aria-hidden="true" className="h-14 lg:h-28" />
        </>
      )}
    </>
  );
}
