import { getDictionary, type Locale } from '@/lib/i18n';
import { localize } from '@/lib/sanity/localize';
import type { OFFICES_QUERY_RESULT, PEOPLE_QUERY_RESULT } from '@/sanity.types';

interface Props {
  locale: Locale;
  /** Counts from the corporate collections - real data, never marketing claims. */
  serviceCount: number;
  industryCount: number;
  officeCount: number;
  people: PEOPLE_QUERY_RESULT;
  offices: OFFICES_QUERY_RESULT;
}

/**
 * Home About (design/Design.pen → Home · Desktop 1440 → About).
 * Navy-950, padding 120/40, gap 56. Statement row: 467px label (14px) +
 * display statement (52px/1.05, -0.6) with a two-column 17px/1.6 body.
 * Four fact cards (navy-800, r16, p24, gap 14): number 72px display,
 * title 16px, note 13px. Mobile: statement 32px, facts in 2×2 (number 56px).
 */
export function AboutSection({
  locale,
  serviceCount,
  industryCount,
  officeCount,
  people,
  offices,
}: Props) {
  const t = getDictionary(locale).home;
  const partnerNames = people
    .map((person) => person.name)
    .filter((name): name is string => Boolean(name))
    .slice(0, 3)
    .join(', ');
  const officeNames = offices
    .map((office) => localize(office.name, locale))
    .filter((name): name is string => Boolean(name))
    .slice(0, 2)
    .join(', ');
  const facts = [
    { value: String(serviceCount), label: t.factsPractices, note: t.factPracticeNote },
    {
      value: String(people.length),
      label: t.factsPartners,
      note: partnerNames,
    },
    {
      value: String(officeCount),
      label: t.factsOffices,
      note: officeNames || t.factOfficeNote,
    },
    { value: String(industryCount), label: t.factsSectors, note: t.factSectorNote },
  ];

  return (
    <section aria-labelledby="about-heading" className="bg-navy-950 text-on-navy">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-14 px-4 py-[72px] md:gap-14 md:px-10 md:py-[120px]">
        <div className="flex w-full flex-col gap-6 md:flex-row">
          <p className="shrink-0 text-sm text-on-navy-2 md:w-[467px]">{t.aboutEyebrow}</p>
          <div className="flex flex-1 flex-col gap-10">
            <h2
              id="about-heading"
              className="font-display text-[32px] leading-[1.05] tracking-[-0.6px] text-balance text-on-navy md:text-[52px]"
            >
              {t.aboutStatement}
            </h2>
            <div className="flex flex-col gap-10 md:flex-row">
              <p className="flex-1 text-[17px] leading-[1.6] text-on-navy-2">{t.aboutP1}</p>
              <p className="flex-1 text-[17px] leading-[1.6] text-on-navy-2">{t.aboutP2}</p>
            </div>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="flex flex-col gap-[14px] rounded-2xl bg-navy-800 p-[18px] md:p-6"
            >
              <dd className="order-1 font-display text-[56px] leading-[1.05] tracking-[-0.6px] text-on-navy md:text-[72px]">
                {fact.value}
              </dd>
              <dt className="order-2 text-[15px] text-on-navy md:text-base">{fact.label}</dt>
              <p className="order-3 text-[13px] leading-relaxed text-on-navy-2">{fact.note}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
