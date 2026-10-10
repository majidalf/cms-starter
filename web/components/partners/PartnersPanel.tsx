import { getDictionary, localePath, type Locale } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { CtaButton } from '@/components/ui/CtaButton';
import { PartnerCard, type PersonCard } from './PartnerCard';

interface Props {
  people: PersonCard[];
  locale: Locale;
  /** Side padding of the page the panel sits on: 40px on the home page, 20px elsewhere. */
  inset?: 'home' | 'page';
  /** The page's own <h1> is elsewhere, so the panel title is an <h2> unless told otherwise. */
  headingLevel?: 'h1' | 'h2';
  id?: string;
}

const INSET = {
  home: 'lg:px-10',
  page: 'lg:px-5',
} as const;

/**
 * Partners panel (Design.pen → Home → Partners, About → Partners): a paper panel with a
 * sticky left column (intro, "OUR PROFESSIONALS", CTA) while the partner cards scroll past
 * (Motion Notes → Partner: sticky at 96px).
 */
export function PartnersPanel({
  people,
  locale,
  inset = 'home',
  headingLevel: Heading = 'h2',
  id,
}: Props) {
  if (people.length === 0) return null;
  const t = getDictionary(locale);
  const contactHref = localePath(locale, routes.contact);

  return (
    <section
      id={id}
      className={`relative mx-auto w-full max-w-[1440px] scroll-mt-24 px-3 pb-3 lg:pb-5 ${INSET[inset]}`}
    >
      <div className="on-paper flex flex-col gap-4 rounded-panel bg-paper p-3 lg:flex-row lg:items-start lg:gap-5 lg:p-5">
        <div className="flex flex-col gap-[10px] px-[6px] pb-2 pt-3 lg:sticky lg:top-24 lg:w-[30%] lg:shrink-0 xl:w-[440px] lg:gap-4 lg:px-1 lg:py-2">
          <p className="text-[14px] leading-[20px] text-ink-2 lg:max-w-[300px] lg:text-[15px] lg:leading-[22px]">
            {t.partnerCard.eyebrow}
          </p>
          <Heading className="font-display text-[min(10.4vw,38px)] leading-[1.053] text-ink lg:text-[52px] lg:leading-[55px] lg:tracking-[-0.6px]">
            {t.partnerCard.headingLine1}
            <br />
            {t.partnerCard.headingLine2}
          </Heading>
          <div aria-hidden="true" className="hidden h-[120px] lg:block" />
          <div className="hidden lg:block">
            <CtaButton href={contactHref} variant="navy">
              {t.bookConsultation}
            </CtaButton>
          </div>
        </div>
        <ul className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-[14px]">
          {people.map((person) => (
            <li key={person._id}>
              <PartnerCard person={person} locale={locale} />
            </li>
          ))}
        </ul>
        <div className="flex justify-center pb-2 pt-3 lg:hidden">
          <CtaButton href={contactHref} variant="navy">
            {t.bookConsultation}
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
