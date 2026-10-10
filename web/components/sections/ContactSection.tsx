import { getDictionary, type Locale } from '@/lib/i18n';
import { telHref } from '@/lib/links';
import { localize } from '@/lib/sanity/localize';
import { AddressLines } from '@/components/collections/AddressLines';
import { ContactForm } from '@/components/forms/ContactForm';
import type { OFFICES_QUERY_RESULT } from '@/sanity.types';

interface Props {
  offices: OFFICES_QUERY_RESULT;
  email?: string | null;
  phone?: string | null;
  locale: Locale;
}

/**
 * Home Contact (design/Design.pen → Home · Desktop 1440 → Contact).
 * Navy-800 panel (r20, gap 40, padding 40/24/24/24): left column with
 * display H2 72px/1.05 (-0.6), lead 18px/1.55 (max 520), and → contact
 * details 17px; right column holds the inquiry form (navy-900, r16, 620px).
 */
export function ContactSection({ offices, email, phone, locale }: Props) {
  const t = getDictionary(locale);
  const ht = t.home;

  return (
    <section aria-labelledby="contact-heading" className="bg-navy-950 text-on-navy">
      <div className="mx-auto w-full max-w-[1400px] px-4 pb-5 md:px-10">
        <div className="flex flex-col gap-8 rounded-[20px] bg-navy-800 p-6 pt-10 md:gap-10 md:p-6 md:pt-10 lg:flex-row lg:pl-6">
          <div className="flex flex-1 flex-col gap-8">
            <h2
              id="contact-heading"
              className="font-display text-[44px] leading-[1.05] tracking-[-0.6px] text-balance text-on-navy md:text-[72px]"
            >
              {ht.contactHeading}
            </h2>
            <p className="w-full max-w-[520px] text-[18px] leading-[1.55] text-on-navy-2">
              {ht.contactIntro}
            </p>
            <ul className="flex flex-col gap-[10px]">
              {email && (
                <li className="text-[17px] text-on-navy">
                  →{' '}
                  <a
                    href={`mailto:${email}`}
                    className="transition-colors hover:text-brass-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li className="text-[17px] text-on-navy">
                  →{' '}
                  <a
                    href={telHref(phone)}
                    className="transition-colors hover:text-brass-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    {phone}
                  </a>
                </li>
              )}
              {offices.map((office, index) => {
                const name = localize(office.name, locale);
                if (!name) return null;
                const role = index === 0 ? t.footerMainOffice : t.footerRepOffice;
                return (
                  <li key={office._id} className="text-[17px] text-on-navy">
                    → {name} · {role}
                    <AddressLines
                      address={office.address}
                      className="mt-1 block text-[15px] text-on-navy-2"
                    />
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="w-full shrink-0 lg:w-[620px]">
            <ContactForm locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}
