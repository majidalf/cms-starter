import Link from 'next/link';
import { detailPath } from '@/lib/collectionRoutes';
import { getDictionary, type Locale } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { localize } from '@/lib/sanity/localize';
import type { INDUSTRIES_QUERY_RESULT } from '@/sanity.types';

interface Props {
  industries: INDUSTRIES_QUERY_RESULT;
  locale: Locale;
}

/**
 * Home Sectors (design/Design.pen → Home · Desktop 1440 → Sectors).
 * Navy-950, padding bottom 140, gap 56. Head: 467px label (14px) + display
 * H2 64px/1.05 (-0.6). Grid: 467px indent + 3 columns (gap 40); cells h88
 * with top rule, number 13px/1.85 + serif name 20px.
 */
export function SectorsSection({ industries, locale }: Props) {
  const t = getDictionary(locale).home;
  const items = industries
    .map((industry, index) => ({
      id: industry._id,
      no: String(index + 1).padStart(2, '0'),
      title: localize(industry.title, locale),
      href: detailPath(locale, routes.industries, industry.slug),
    }))
    .filter((item) => item.title && item.href);
  if (items.length === 0) return null;
  const columns: (typeof items)[] = [[], [], []];
  items.forEach((item, index) => {
    columns[index % 3].push(item);
  });

  return (
    <section aria-labelledby="sectors-heading" className="bg-navy-950 text-on-navy">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-4 pb-[72px] md:gap-14 md:px-10 md:pb-[140px]">
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <p className="shrink-0 text-sm text-on-navy-2 md:w-[467px]">{t.sectorsEyebrow}</p>
          <h2
            id="sectors-heading"
            className="flex-1 font-display text-[32px] leading-[1.05] tracking-[-0.6px] text-balance text-on-navy md:text-[64px]"
          >
            {t.sectorsHeading}
          </h2>
        </div>
        <div className="flex w-full">
          <div aria-hidden="true" className="hidden w-[467px] shrink-0 md:block" />
          <div className="grid flex-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {columns
              .filter((column) => column.length > 0)
              .map((column) => (
                <div key={`sector-col-${column[0].id}`} className="flex flex-col">
                  {column.map((item) => (
                    <div
                      key={item.id}
                      className="flex min-h-[88px] gap-3 border-t border-line-navy pt-4"
                    >
                      <span
                        aria-hidden="true"
                        className="w-10 shrink-0 text-[13px] leading-[1.85] text-on-navy-2"
                      >
                        {item.no}
                      </span>
                      <h3 className="flex-1 pb-4 font-serif text-[20px] leading-snug text-on-navy">
                        {item.href ? (
                          <Link
                            href={item.href}
                            className="transition-colors hover:text-brass-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
                          >
                            {item.title}
                          </Link>
                        ) : (
                          item.title
                        )}
                      </h3>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
