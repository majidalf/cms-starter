import type { Locale } from '@/lib/i18n';
import { localize } from '@/lib/sanity/localize';
import type { INDUSTRIES_QUERY_RESULT } from '@/sanity.types';

interface Props {
  industries: INDUSTRIES_QUERY_RESULT;
  locale: Locale;
}

const DIGITS = 2;

/** Numbered sector list: three ruled columns on desktop, one on phones
 * (Design.pen → Home → Sectors → Sector Grid). Sectors are names only - no links. */
export function SectorGrid({ industries, locale }: Props) {
  return (
    <ol className="grid flex-1 grid-cols-1 lg:grid-cols-3 lg:gap-x-10">
      {industries.map((industry, index) => (
        <li
          key={industry._id}
          className="flex min-h-[64px] gap-3 border-t border-line-navy pb-4 pt-4 lg:min-h-[88px] lg:pb-0"
        >
          <span className="w-10 shrink-0 text-[13px] leading-[24px] text-on-navy-2">
            {String(index + 1).padStart(DIGITS, '0')}
          </span>
          <span className="min-w-0 flex-1 font-serif wrap-break-word text-[20px] leading-[25px] text-on-navy">
            {localize(industry.title, locale)}
          </span>
        </li>
      ))}
    </ol>
  );
}
