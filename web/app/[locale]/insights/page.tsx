import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary, isLocale, localePath } from '@/lib/i18n';
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

interface Props {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ category?: string | string[] }>;
}

/**
 * Insights (design/Design.pen -> Insights · Desktop 1440): breadcrumb header,
 * category filter chips and the article list on navy-950. The filter is a
 * plain `?category=` link - server-rendered, no client JavaScript. With no
 * articles the page shows the designed empty state instead of a bare list.
 */
export default async function InsightsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const insights = await getInsights();
  const base = localePath(locale, routes.insights);

  const categories = (
    Object.keys(t.insightCategories) as (keyof typeof t.insightCategories)[]
  ).filter((category) => insights.some((insight) => insight.category === category));
  const requestedParam = (await searchParams)?.category;
  const requested = Array.isArray(requestedParam) ? requestedParam[0] : requestedParam;
  const active = categories.includes(requested as (typeof categories)[number])
    ? (requested as string)
    : undefined;
  const visible = active ? insights.filter((insight) => insight.category === active) : insights;
  const entries = insightEntries(visible, locale);

  return (
    <div className="bg-navy-950 text-on-navy">
      <PageHeader
        locale={locale}
        path={base}
        title={t.insightsPage.heading}
        eyebrow={t.insights}
        intro={t.insightsPage.lead}
      />

      {categories.length > 0 && (
        <nav aria-label={t.insightsPage.filter} className="pb-10">
          <Container className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-on-navy-2">{t.insightsPage.filter}</span>
            <ul className="flex flex-wrap gap-2.5">
              <li>
                <Link
                  href={base}
                  aria-current={active === undefined ? 'page' : undefined}
                  className={`inline-flex rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
                    active === undefined
                      ? 'bg-paper text-navy-900'
                      : 'border border-on-navy/30 text-on-navy-2 hover:border-brass-light hover:text-brass-light'
                  }`}
                >
                  {t.insightsPage.all}
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`${base}?category=${category}`}
                    aria-current={active === category ? 'page' : undefined}
                    className={`inline-flex rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
                      active === category
                        ? 'bg-paper text-navy-900'
                        : 'border border-on-navy/30 text-on-navy-2 hover:border-brass-light hover:text-brass-light'
                    }`}
                  >
                    {t.insightCategories[category]}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      )}

      <Container className="pb-20">
        {entries.length === 0 ? (
          <div className="flex max-w-2xl flex-col gap-5 border-t border-on-navy/15 pt-10">
            <h2 className="font-display text-4xl leading-tight text-on-navy">
              {t.insightsPage.emptyTitle}
            </h2>
            <p className="text-lg leading-relaxed text-on-navy-2">{t.insightsPage.emptyText}</p>
            <ul className="flex flex-wrap gap-x-7 gap-y-2 pt-2">
              <li>
                <Link
                  href={localePath(locale, routes.services)}
                  className="inline-flex items-center gap-2 border-b border-on-navy/40 pb-1 font-medium text-on-navy transition-colors hover:border-brass-light hover:text-brass-light"
                >
                  {t.services}
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
              <li>
                <Link
                  href={localePath(locale, routes.contact)}
                  className="inline-flex items-center gap-2 border-b border-on-navy/40 pb-1 font-medium text-on-navy transition-colors hover:border-brass-light hover:text-brass-light"
                >
                  {t.contact}
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <EntryList entries={entries} />
        )}
      </Container>
    </div>
  );
}
