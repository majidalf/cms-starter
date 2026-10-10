import Link from 'next/link';
import { detailPath } from '@/lib/collectionRoutes';
import { formatDate, getDictionary, type Locale } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { localize } from '@/lib/sanity/localize';
import type { INSIGHTS_QUERY_RESULT } from '@/sanity.types';

interface Props {
  insights: INSIGHTS_QUERY_RESULT;
  locale: Locale;
}

const MAX_INSIGHTS = 3;

/**
 * Home Insights (design/Design.pen → Home · Desktop 1440 → Insights).
 * Navy-950, padding bottom 140, gap 56. Head: 467px label (14px) + display
 * H2 64px/1.05 (-0.6). Cards (navy-900, r16, navy-800 border, p24, h300,
 * space-between): category pill + date 13px, serif title 26px/1.2.
 * Renders nothing until the first article is published.
 */
export function InsightsSection({ insights, locale }: Props) {
  const t = getDictionary(locale);
  const ht = t.home;
  const items = insights
    .map((insight) => {
      const title = localize(insight.title, locale);
      const href = detailPath(locale, routes.insights, insight.slug);
      if (!title || !href) return undefined;
      return {
        id: insight._id,
        title,
        href,
        category: insight.category ? t.insightCategories[insight.category] : undefined,
        date: formatDate(insight.publishedAt, locale),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, MAX_INSIGHTS);
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="insights-heading" className="bg-navy-950 text-on-navy">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-4 pb-[72px] md:gap-14 md:px-10 md:pb-[140px]">
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <p className="shrink-0 text-sm text-on-navy-2 md:w-[467px]">{ht.insightsEyebrow}</p>
          <h2
            id="insights-heading"
            className="flex-1 font-display text-[32px] leading-[1.05] tracking-[-0.6px] text-balance text-on-navy md:text-[64px]"
          >
            {ht.insightsHeading}
          </h2>
        </div>
        <div className="flex w-full">
          <div aria-hidden="true" className="hidden w-[467px] shrink-0 md:block" />
          <ul className="grid flex-1 gap-3 md:grid-cols-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex min-h-[300px] flex-col justify-between gap-6 rounded-2xl border border-navy-800 bg-navy-900 p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  {item.category && (
                    <span className="rounded-full border border-navy-700 px-[10px] py-[4px] text-xs text-on-navy">
                      {item.category}
                    </span>
                  )}
                  {item.date && <p className="text-[13px] text-on-navy-2">{item.date}</p>}
                </div>
                <h3 className="font-serif text-[26px] leading-[1.2] text-on-navy">
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-brass-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
                  >
                    {item.title}
                  </Link>
                </h3>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
