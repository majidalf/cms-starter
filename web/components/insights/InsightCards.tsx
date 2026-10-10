import Link from 'next/link';
import { detailPath } from '@/lib/collectionRoutes';
import { formatShortDate, getDictionary, type Locale } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { localize } from '@/lib/sanity/localize';
import { DesignNote } from '@/components/ui/DesignNote';
import { TagPill } from '@/components/ui/Pill';
import type { INSIGHTS_QUERY_RESULT } from '@/sanity.types';

interface Props {
  insights: INSIGHTS_QUERY_RESULT;
  locale: Locale;
}

const CARD_COUNT = 3;

/**
 * Home → Insights (Design.pen): the three latest articles as cards - category and date on
 * top, title at the bottom. The section stays hidden until the first article is published.
 */
export function HomeInsights({ insights, locale }: Props) {
  const t = getDictionary(locale);
  const latest = insights.slice(0, CARD_COUNT);
  if (latest.length === 0) return null;

  return (
    <section
      id="insights"
      className="relative mx-auto flex w-full max-w-[1440px] scroll-mt-24 flex-col gap-6 px-4 pb-[72px] pt-14 lg:gap-14 lg:px-10 lg:pb-[140px] lg:pt-[120px]"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-0">
        <p className="text-[13px] leading-[15px] text-on-navy-2 lg:w-[calc((100%+40px)/3)] lg:shrink-0 lg:text-[14px] lg:leading-[17px]">
          {t.home.insightsLabel}
        </p>
        <h2 className="flex-1 font-display text-[44px] leading-[46px] tracking-[-0.6px] text-on-navy lg:text-[min(4.444vw,64px)] lg:leading-[1.047]">
          {t.home.insightsHeading}
        </h2>
      </div>
      <ul className="flex flex-col gap-3 lg:flex-row">
        {latest.map((insight) => {
          const href = detailPath(locale, routes.insights, insight.slug);
          const title = localize(insight.title, locale);
          if (!href || !title) return null;
          return (
            <li key={insight._id} className="flex flex-1">
              <Link
                href={href}
                className="group flex min-h-[220px] flex-1 flex-col justify-between gap-10 rounded-card bg-navy-900 p-6 outline-1 -outline-offset-1 outline-navy-800 transition-colors duration-200 hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring lg:min-h-[300px]"
              >
                <span className="flex items-start justify-between gap-3">
                  {insight.category && (
                    <TagPill>{t.insightCategories[insight.category] ?? insight.category}</TagPill>
                  )}
                  <span className="text-[13px] leading-[15px] text-on-navy-2">
                    {formatShortDate(insight.publishedAt, locale)}
                  </span>
                </span>
                <span className="font-serif text-[22px] leading-[26px] text-on-navy transition-colors duration-200 group-hover:text-brass-light lg:text-[26px] lg:leading-[31px]">
                  {title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <DesignNote>{t.home.insightsNote}</DesignNote>
    </section>
  );
}
