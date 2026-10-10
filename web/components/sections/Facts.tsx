import type { CSSProperties } from 'react';
import { getDictionary, type Locale } from '@/lib/i18n';

interface Props {
  locale: Locale;
  practiceAreaCount: number;
  /** Partner names without titles, for the note under the count. */
  partnerNames: string[];
  officeCount: number;
  sectorCount: number;
}

/**
 * Fact cards (Design.pen → 01 Components → Fact Card; Home → About → Facts). Four across
 * on desktop with a note under each title; two by two on phones, without the notes. The
 * numbers are counted from the CMS, so they follow the content. Cards rise in 100ms apart
 * (Motion Notes → Tentang).
 */
export function Facts({
  locale,
  practiceAreaCount,
  partnerNames,
  officeCount,
  sectorCount,
}: Props) {
  const t = getDictionary(locale).facts;
  const facts = [
    {
      key: 'practice',
      count: practiceAreaCount,
      title: t.practiceAreas,
      note: t.practiceAreasNote,
    },
    {
      key: 'partners',
      count: partnerNames.length,
      title: t.partners,
      note: partnerNames.join(', '),
    },
    { key: 'offices', count: officeCount, title: t.offices, note: t.officesNote },
    { key: 'sectors', count: sectorCount, title: t.sectors, note: t.sectorsNote },
  ].filter((fact) => fact.count > 0);

  return (
    <ul className="grid grid-cols-2 gap-[10px] lg:flex lg:items-start lg:gap-3">
      {facts.map((fact, index) => (
        <li
          key={fact.key}
          style={{ '--i': index } as CSSProperties}
          className="rise-in flex flex-1 flex-col gap-[10px] rounded-card bg-navy-800 p-[18px] lg:gap-[14px] lg:p-6"
        >
          <p className="font-display text-[56px] leading-[59px] tracking-[-0.6px] text-on-navy lg:text-[72px] lg:leading-[76px]">
            {fact.count}
          </p>
          <p className="text-[14px] leading-[17px] text-on-navy lg:text-[16px] lg:leading-[19px]">
            {fact.title}
          </p>
          {fact.note && (
            <p className="hidden text-[13px] leading-[15px] text-on-navy-2 lg:block">{fact.note}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
