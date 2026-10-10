import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary, isLocale, localePath, type Dictionary, type Locale } from '@/lib/i18n';
import { safeHref, telHref } from '@/lib/links';
import { listPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import { getOffices } from '@/lib/sanity/collections/office';
import { getServices } from '@/lib/sanity/collections/service';
import { localize, localizeList } from '@/lib/sanity/localize';
import { getSiteSettings } from '@/lib/sanity/queries';
import { ContactPanel } from '@/components/contact/ContactPanel';
import { PageHeader } from '@/components/sections/PageHeader';
import { UnderlineLink } from '@/components/ui/UnderlineLink';
import type { OFFICES_QUERY_RESULT } from '@/sanity.types';

export function generateMetadata({ params }: PageProps<'/[locale]/contact'>): Promise<Metadata> {
  return listPageMetadata(params, routes.contact, (t) => t.contact);
}

interface RowProps {
  label: string;
  value?: string | null;
  placeholder?: string;
  href?: string;
}

function OfficeRow({ label, value, placeholder, href }: RowProps) {
  const text = value || placeholder;
  if (!text) return null;
  return (
    <div className="flex flex-col gap-[3px] border-t border-line-navy py-3 last:border-b lg:flex-row lg:gap-6 lg:py-[14px]">
      <dt className="text-[12px] leading-[14px] text-on-navy-2 lg:w-[100px] lg:shrink-0 lg:text-[14px] lg:leading-[20px]">
        {label}
      </dt>
      <dd
        className={`whitespace-pre-line text-[16px] leading-[19px] lg:text-[17px] lg:leading-[20px] ${
          value ? 'text-on-navy' : 'text-on-navy-2'
        }`}
      >
        {href && value ? (
          <a href={href} className="transition-colors hover:text-brass-light">
            {value}
          </a>
        ) : (
          text
        )}
      </dd>
    </div>
  );
}

interface OfficeCardProps {
  office: OFFICES_QUERY_RESULT[number];
  locale: Locale;
  labels: Dictionary['contactPage'];
  fallbackEmail?: string | null;
  fallbackPhone?: string | null;
}

/** Office card (Design.pen → Contact → Offices): kind, city, map area and four ruled rows.
 * Until an address and hours are entered, the rows say so. */
function OfficeCard({ office, locale, labels, fallbackEmail, fallbackPhone }: OfficeCardProps) {
  const address = office.address;
  const street = [
    address?.street,
    [address?.city, address?.province, address?.postalCode].filter(Boolean).join(', '),
  ]
    .filter(Boolean)
    .join('\n');
  const mapHref = safeHref(address?.mapUrl);
  const phone = office.phone ?? fallbackPhone;
  const email = office.email ?? fallbackEmail;

  return (
    <article className="flex flex-1 flex-col gap-5 rounded-panel bg-navy-900 p-5 lg:gap-7 lg:p-7">
      <div className="flex flex-col gap-[6px] lg:gap-2">
        <p className="text-[13px] leading-[15px] text-brass-light lg:text-[14px] lg:leading-[17px]">
          {localize(office.kind, locale)}
        </p>
        <h2 className="font-display text-[40px] leading-[42px] text-on-navy lg:text-[56px] lg:leading-[59px] lg:tracking-[-0.6px]">
          {localize(office.name, locale)}
        </h2>
      </div>
      <div className="flex h-[140px] items-center justify-center rounded-photo bg-navy-800 px-4 text-center lg:h-[200px]">
        {mapHref ? (
          <UnderlineLink href={mapHref} size="md" icon="arrowUpRight" external>
            {labels.viewMap}
          </UnderlineLink>
        ) : (
          <p className="text-[12px] leading-[14px] text-on-navy-2 lg:text-[13px] lg:leading-[15px]">
            {labels.mapNote}
          </p>
        )}
      </div>
      <dl className="flex flex-col">
        <OfficeRow
          label={labels.address}
          value={address?.street ? street : undefined}
          placeholder={labels.addressToFollow}
        />
        <OfficeRow label={labels.phone} value={phone} href={phone ? telHref(phone) : undefined} />
        <OfficeRow
          label={labels.email}
          value={email}
          href={email ? `mailto:${email}` : undefined}
        />
        <OfficeRow
          label={labels.hours}
          value={localize(office.hours, locale)}
          placeholder={labels.toBeProvided}
        />
      </dl>
    </article>
  );
}

/**
 * Contact (Design.pen → Contact · Desktop 1440 / Mobile 375): header, one card per office,
 * then the same contact panel and form as the home page.
 */
export default async function ContactPage({ params }: PageProps<'/[locale]/contact'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [settings, offices, services] = await Promise.all([
    getSiteSettings(),
    getOffices(),
    getServices(),
  ]);
  const t = getDictionary(locale);

  return (
    <>
      <PageHeader
        breadcrumbLabel={t.breadcrumb}
        breadcrumb={[{ label: t.homeLabel, href: localePath(locale) }, { label: t.contact }]}
        label={t.contactPage.label}
        title={t.contactPage.heading}
        titleSize="xl"
        lead={t.contactPage.lead}
        spacing="pb-10 lg:pb-20"
      />
      {offices.length > 0 && (
        <section className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-3 pb-3 lg:flex-row lg:gap-4 lg:px-5 lg:pb-4">
          {offices.map((office) => (
            <OfficeCard
              key={office._id}
              office={office}
              locale={locale}
              labels={t.contactPage}
              fallbackEmail={settings?.email}
              fallbackPhone={settings?.phone}
            />
          ))}
        </section>
      )}
      <ContactPanel
        locale={locale}
        email={settings?.email}
        phone={settings?.phone}
        offices={offices}
        practiceAreas={localizeList(
          services.map((service) => service.title),
          locale,
        )}
        inset="page"
        id="form"
      />
      <div aria-hidden="true" className="h-14 lg:h-20" />
    </>
  );
}
