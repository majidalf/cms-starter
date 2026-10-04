import { notFound } from 'next/navigation';
import { getDictionary, isLocale } from '@/lib/i18n';
import { safeHref, telHref } from '@/lib/links';
import { listPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import { getOffices } from '@/lib/sanity/collections/office';
import { localize } from '@/lib/sanity/localize';
import { getSiteSettings } from '@/lib/sanity/queries';
import { AddressLines } from '@/components/collections/AddressLines';
import { PageHeader } from '@/components/collections/PageHeader';
import { Container } from '@/components/ui/Container';

// The contact form is the optional `contact-form` module (plan Section 5.5, phase T5).

export function generateMetadata({ params }: PageProps<'/[locale]/contact'>) {
  return listPageMetadata(params, routes.contact, (t) => t.contact);
}

export default async function ContactPage({ params }: PageProps<'/[locale]/contact'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const [settings, offices] = await Promise.all([getSiteSettings(), getOffices()]);

  return (
    <>
      <PageHeader title={t.contact}>
        <dl className="flex flex-wrap gap-x-10 gap-y-2">
          {settings?.email && (
            <div>
              <dt className="text-sm text-muted">{t.email}</dt>
              <dd>
                <a href={`mailto:${settings.email}`} className="underline underline-offset-2">
                  {settings.email}
                </a>
              </dd>
            </div>
          )}
          {settings?.phone && (
            <div>
              <dt className="text-sm text-muted">{t.phone}</dt>
              <dd>
                <a href={telHref(settings.phone)} className="underline underline-offset-2">
                  {settings.phone}
                </a>
              </dd>
            </div>
          )}
        </dl>
      </PageHeader>
      {offices.length > 0 && (
        <section aria-labelledby="offices" className="pb-20">
          <Container className="flex flex-col gap-8">
            <h2 id="offices" className="font-serif text-2xl text-brand">
              {t.offices}
            </h2>
            <ul className="grid gap-x-10 gap-y-10 md:grid-cols-2">
              {offices.map((office) => {
                const mapUrl = safeHref(office.address?.mapUrl);
                return (
                  <li key={office._id} className="flex flex-col gap-3 border-t border-ink/15 pt-5">
                    <h3 className="font-serif text-xl text-brand">
                      {localize(office.name, locale)}
                    </h3>
                    <AddressLines address={office.address} className="text-sm" />
                    <ul className="flex flex-col gap-1 text-sm">
                      {office.phone && (
                        <li>
                          <span className="text-muted">{t.phone}: </span>
                          <a href={telHref(office.phone)} className="underline underline-offset-2">
                            {office.phone}
                          </a>
                        </li>
                      )}
                      {office.email && (
                        <li>
                          <span className="text-muted">{t.email}: </span>
                          <a
                            href={`mailto:${office.email}`}
                            className="underline underline-offset-2"
                          >
                            {office.email}
                          </a>
                        </li>
                      )}
                      {mapUrl && (
                        <li>
                          <a
                            href={mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2"
                          >
                            {t.viewMap}
                          </a>
                        </li>
                      )}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
