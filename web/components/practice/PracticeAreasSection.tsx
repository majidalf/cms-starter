import { detailPath } from '@/lib/collectionRoutes';
import { fill, getDictionary, type Locale } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { localize, localizeList } from '@/lib/sanity/localize';
import { DesignNote } from '@/components/ui/DesignNote';
import { PracticeIndex, type PracticePanel } from './PracticeIndex';
import type { SERVICE_PANELS_QUERY_RESULT } from '@/sanity.types';

interface Props {
  services: SERVICE_PANELS_QUERY_RESULT;
  locale: Locale;
  /** On the practice areas index page the page header already carries the title. */
  showHead?: boolean;
}

const DIGITS = 2;

export function toPracticePanels(
  services: SERVICE_PANELS_QUERY_RESULT,
  locale: Locale,
): PracticePanel[] {
  return services.flatMap((service, index) => {
    const title = localize(service.title, locale);
    if (!title) return [];
    return [
      {
        id: service._id,
        number: String(index + 1).padStart(DIGITS, '0'),
        title,
        href: detailPath(locale, routes.services, service.slug),
        scope: localizeList(service.scope, locale),
        citation: localizeList(service.legalBasis, locale)[0],
      },
    ];
  });
}

/**
 * Practice Areas (Design.pen → Home · Desktop 1440 → Practice Areas): a navy-900 band with
 * the section head, then the index and its detail panel.
 */
export function PracticeAreasSection({ services, locale, showHead = true }: Props) {
  const areas = toPracticePanels(services, locale);
  if (areas.length === 0) return null;
  const t = getDictionary(locale);
  const count = t.countWords[areas.length] ?? String(areas.length);

  return (
    <section id="practice-areas" className="relative scroll-mt-24 bg-navy-900">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 py-[72px] lg:gap-[72px] lg:px-10 lg:py-36">
        {showHead && (
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-10">
            <div className="flex flex-1 flex-col gap-8 lg:gap-5">
              <p className="font-serif text-[15px] italic leading-[18px] text-on-navy-2 lg:text-[17px] lg:leading-[21px]">
                {t.home.practiceLabel}
              </p>
              <h2 className="font-display text-[44px] leading-[46px] tracking-[-0.6px] text-on-navy lg:text-[min(5vw,72px)] lg:leading-[1.014] lg:tracking-[-1px]">
                {fill(t.home.practiceHeading, { count })}
              </h2>
            </div>
            <p className="text-[16px] leading-[24px] text-on-navy-2 lg:w-[360px] lg:text-[20px] lg:leading-[30px]">
              {t.home.practiceLead}
            </p>
          </div>
        )}
        <PracticeIndex
          areas={areas}
          labels={{
            list: t.services,
            view: t.viewPracticeArea,
          }}
        />
        <DesignNote className="hidden lg:block">{t.home.practiceNote}</DesignNote>
        <DesignNote className="text-[12px] lg:hidden">{t.home.practiceNoteMobile}</DesignNote>
      </div>
    </section>
  );
}
