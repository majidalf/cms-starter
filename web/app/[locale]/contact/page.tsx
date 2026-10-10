import { notFound } from 'next/navigation';
import { getDictionary, isLocale, localePath } from '@/lib/i18n';
import { safeHref, telHref } from '@/lib/links';
import { listPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import { getOffices } from '@/lib/sanity/collections/office';
import { localize } from '@/lib/sanity/localize';
import { getSiteSettings } from '@/lib/sanity/queries';
import { AddressLines } from '@/components/collections/AddressLines';
import { PageHeader } from '@/components/collections/PageHeader';
import { Container } from '@/components/ui/Container';
import { ContactForm } from '@/components/forms/ContactForm';

// The contact form is the optional `contact-form` module (plan Section 5.5, phase T5).

export function generateMetadata({ params }: PageProps<'/[locale]/contact'>) {
  return listPageMetadata(params, routes.contact, (t) => t.contact);
}

/**
 * Contact (design/Design.pen -> Contact · Desktop 1440): breadcrumb header,
 * office cards on navy-900 with a map placeholder, and the inquiry form in a
 * navy-800 panel next to the direct contact details.
 */
export default async function ContactPage({ params }: PageProps<'/[locale]/contact'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const [settings, offices] = await Promise.all([getSiteSettings(), getOffices()]);
  const direct = [
    settings?.email && { href: `mailto:${settings.email}`, label: settings.email },
    settings?.phone && { href: telHref(settings.phone), label: settings.phone },
  ].filter((item): item is { href: string; label: string } => Boolean(item));

  return (
    <div className="bg-navy-950 text-on-navy">
      <PageHeader
        locale={locale}
        path={localePath(locale, routes.contact)}
        title={t.contactPage.heading}
        eyebrow={t.contact}
        intro={t.contactPage.lead}
      />

      {offices.length > 0 && (
        <section aria-labelledby="offices" className="pb-4 pt-4 md:pb-8">
          <Container>
            <h2 id="offices" className="sr-only">
              {t.offices}
            </h2>
            <ul className="grid gap-6 md:grid-cols-2">
              {offices.map((office) => {
                const mapUrl = safeHref(office.address?.mapUrl);
                return (
                  <li
                    key={office._id}
                    className="flex flex-col gap-5 rounded-panel border border-on-navy/15 bg-navy-900 p-8"
                  >
                    <h3 className="font-serif text-2xl text-on-navy">
                      {localize(office.name, locale)}
                    </h3>
                    <div className="flex min-h-28 items-center justify-center rounded-card bg-navy-800 px-6 py-8 text-center text-sm text-on-navy-2">
                      {mapUrl ? (
                        <a
                          href={mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-4 hover:text-brass-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                        >
                          {t.viewMap}
                        </a>
                      ) : (
                        t.contactPage.mapNote
                      )}
                    </div>
                    <dl className="flex flex-col gap-3 text-sm">
                      <div className="flex gap-3">
                        <dt className="w-16 shrink-0 text-on-navy-2">{t.location}</dt>
                        <dd>
                          <AddressLines address={office.address} className="text-on-navy" />
                        </dd>
                      </div>
                      {office.phone && (
                        <div className="flex gap-3">
                          <dt className="w-16 shrink-0 text-on-navy-2">{t.phone}</dt>
                          <dd>
                            <a
                              href={telHref(office.phone)}
                              className="text-on-navy underline underline-offset-2 hover:text-brass-light"
                            >
                              {office.phone}
                            </a>
                          </dd>
                        </div>
                      )}
                      {office.email && (
                        <div className="flex gap-3">
                          <dt className="w-16 shrink-0 text-on-navy-2">{t.email}</dt>
                          <dd>
                            <a
                              href={`mailto:${office.email}`}
                              className="text-on-navy underline underline-offset-2 hover:text-brass-light"
                            >
                              {office.email}
                            </a>
                          </dd>
                        </div>
                      )}
                    </dl>
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>
      )}

      <section aria-labelledby="contact-form-heading" className="py-12 md:py-16">
        <Container>
          <div className="grid gap-10 rounded-panel bg-navy-800 p-8 md:p-12 lg:grid-cols-2">
            <div className="flex flex-col items-start gap-5">
              <h2
                id="contact-form-heading"
                className="font-display text-3xl leading-tight tracking-tight text-balance text-on-navy md:text-4xl"
              >
                {t.contactPage.formHeading}
              </h2>
              <p className="max-w-xl leading-relaxed text-on-navy-2">{t.contactPage.formLead}</p>
              {direct.length > 0 && (
                <ul className="flex flex-col gap-2 text-on-navy">
                  {direct.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="underline underline-offset-4 hover:text-brass-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                      >
                        → {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <ContactForm locale={locale} />
          </div>
        </Container>
      </section>
      <div className="pb-8" />
    </div>
  );
}
