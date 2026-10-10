import { getDictionary, type Locale } from '@/lib/i18n';
import { telHref } from '@/lib/links';
import { localize } from '@/lib/sanity/localize';
import { ContactForm } from './ContactForm';
import type { OFFICES_QUERY_RESULT } from '@/sanity.types';

interface Props {
  locale: Locale;
  email?: string | null;
  phone?: string | null;
  offices: OFFICES_QUERY_RESULT;
  /** Practice area titles for the form's select, already in this language. */
  practiceAreas: string[];
  defaultPracticeArea?: string;
  /** Side padding of the page: 40px on the home page, 20px on inner pages. */
  inset?: 'home' | 'page';
  id?: string;
}

const INSET = { home: 'lg:px-10', page: 'lg:px-5' } as const;
const DETAIL = 'w-fit text-[15px] leading-[18px] text-on-navy lg:text-[17px] lg:leading-[20px]';

/**
 * Contact panel (Design.pen → Home → Contact, Contact → Contact Form Section): heading,
 * lead and the direct contact lines on the left, the form on the right.
 */
export function ContactPanel({
  locale,
  email,
  phone,
  offices,
  practiceAreas,
  defaultPracticeArea,
  inset = 'home',
  id = 'contact',
}: Props) {
  const t = getDictionary(locale);
  const form = t.contactForm;

  return (
    <section
      id={id}
      className={`relative mx-auto w-full max-w-[1440px] scroll-mt-24 px-3 pb-3 lg:pb-5 ${INSET[inset]}`}
    >
      <div className="flex flex-col gap-6 rounded-panel bg-navy-800 px-4 pb-4 pt-7 lg:flex-row lg:gap-10 lg:px-6 lg:pb-6 lg:pt-10">
        <div className="flex flex-1 flex-col gap-6 lg:gap-8">
          <h2 className="font-display text-[44px] leading-[46px] text-on-navy lg:text-[min(5vw,72px)] lg:leading-[1.056] lg:tracking-[-0.6px]">
            {form.heading}
          </h2>
          <p className="text-[16px] leading-[24px] text-on-navy-2 lg:max-w-[520px] lg:text-[18px] lg:leading-[28px]">
            {form.lead}
          </p>
          <ul className="flex flex-col gap-2 lg:gap-[10px]">
            {email && (
              <li className="flex">
                <a
                  href={`mailto:${email}`}
                  className={`${DETAIL} transition-colors hover:text-brass-light`}
                >
                  <span aria-hidden="true">→ </span>
                  {email}
                </a>
              </li>
            )}
            {phone && (
              <li className="flex">
                <a
                  href={telHref(phone)}
                  className={`${DETAIL} transition-colors hover:text-brass-light`}
                >
                  <span aria-hidden="true">→ </span>
                  {phone}
                </a>
              </li>
            )}
            {offices.map((office) => {
              const hasAddress = Boolean(office.address?.street);
              const parts = [
                localize(office.name, locale),
                localize(office.kind, locale),
                hasAddress ? office.address?.street : undefined,
              ].filter(Boolean);
              return (
                <li key={office._id} className={DETAIL}>
                  <span aria-hidden="true">→ </span>
                  {parts.join(' · ')}
                  {!hasAddress && (
                    <span className="hidden lg:inline"> · {form.addressToFollow}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="rounded-card bg-navy-900 p-4 lg:w-[620px] lg:max-w-[46%] lg:shrink-0 lg:p-6">
          <ContactForm
            locale={locale}
            labels={form}
            practiceAreas={practiceAreas}
            defaultPracticeArea={defaultPracticeArea}
          />
        </div>
      </div>
    </section>
  );
}
