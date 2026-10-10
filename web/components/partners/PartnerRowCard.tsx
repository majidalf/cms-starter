import { detailPath } from '@/lib/collectionRoutes';
import { getDictionary, type Locale } from '@/lib/i18n';
import { nameWithTitles } from '@/lib/people';
import { routes } from '@/lib/routes';
import { localize, localizeList } from '@/lib/sanity/localize';
import { SanityImage } from '@/components/SanityImage';
import { UnderlineLink } from '@/components/ui/UnderlineLink';
import type { PersonCard } from './PartnerCard';

interface Props {
  person: PersonCard;
  locale: Locale;
  /** `row`: "Other partners" on a profile (photo 200×250). `author`: under an article
   * (photo 100×125, no focus line). */
  variant?: 'row' | 'author';
}

const PHOTO = {
  row: 'h-[150px] w-[120px] lg:h-[200px] lg:w-[160px] xl:h-[250px] xl:w-[200px]',
  author: 'h-[110px] w-[88px] lg:h-[125px] lg:w-[100px]',
} as const;

const BODY = {
  row: 'min-h-[150px] py-1 pr-1 lg:min-h-[200px] lg:py-2 lg:pr-2 xl:min-h-[250px]',
  author: 'min-h-[110px] py-1 pr-1 lg:min-h-[125px] lg:py-[6px] lg:pr-[6px]',
} as const;

const NAME = {
  row: 'text-[18px] leading-[21px] lg:text-[24px] lg:leading-[28px]',
  author: 'text-[17px] leading-[20px] lg:text-[20px] lg:leading-[24px]',
} as const;

/** Small partner card: photo left, name / role / focus and a "View profile" link right
 * (Design.pen → Partner Profile → Other partners, Insights Article → Author Card). */
export function PartnerRowCard({ person, locale, variant = 'row' }: Props) {
  const t = getDictionary(locale);
  const href = detailPath(locale, routes.leadership, person.slug);
  const focus = localizeList(person.focusAreas, locale).join(' · ');
  const isRow = variant === 'row';

  return (
    <article
      className={`flex min-w-0 flex-1 gap-4 rounded-card bg-navy-900 p-[10px] lg:p-3 ${isRow ? 'lg:gap-5' : 'lg:gap-5'}`}
    >
      <div className={`shrink-0 overflow-hidden rounded-photo bg-navy-800 ${PHOTO[variant]}`}>
        <SanityImage
          image={person.photo}
          locale={locale}
          sizes="200px"
          className="h-full w-full object-cover"
        />
      </div>
      <div className={`flex min-w-0 flex-1 flex-col justify-between gap-3 ${BODY[variant]}`}>
        <div className={`flex flex-col ${isRow ? 'gap-[6px] lg:gap-2' : 'gap-1'}`}>
          <h3 className={`font-serif wrap-break-word text-on-navy ${NAME[variant]}`}>
            {nameWithTitles(person.name, person.titles)}
          </h3>
          <p
            className={`text-on-navy-2 ${
              isRow ? 'hidden text-[15px] leading-[18px] lg:block' : 'text-[14px] leading-[17px]'
            }`}
          >
            {localize(person.position, locale)}
          </p>
          {isRow && focus && (
            <p className="text-[12px] leading-[14px] text-on-navy-2 lg:text-[13px] lg:leading-[15px]">
              {focus}
            </p>
          )}
        </div>
        {href && (
          <UnderlineLink href={href} size="md" icon="arrowUpRight">
            {t.viewProfile}
          </UnderlineLink>
        )}
      </div>
    </article>
  );
}
