import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { detailPath, redirectToLocalizedSlug, slugParams } from '@/lib/collectionRoutes';
import { fill, getDictionary, isLocale, languageName, localePath } from '@/lib/i18n';
import { breadcrumbJsonLd, personJsonLd } from '@/lib/jsonLd';
import { telHref } from '@/lib/links';
import { detailPageMetadata } from '@/lib/pageMetadata';
import { firstName, nameWithTitles } from '@/lib/people';
import { routes } from '@/lib/routes';
import {
  getPeople,
  getPersonByAnySlug,
  getPersonBySlug,
  getPersonSlugs,
} from '@/lib/sanity/collections/person';
import { localize } from '@/lib/sanity/localize';
import { getSiteSettings } from '@/lib/sanity/queries';
import { absoluteUrl, siteUrl } from '@/lib/site';
import { JsonLd } from '@/components/JsonLd';
import { HeaderSpacer } from '@/components/layout/HeaderSpacer';
import { PartnerRowCard } from '@/components/partners/PartnerRowCard';
import { PortableTextRenderer } from '@/components/PortableTextRenderer';
import { SanityImage } from '@/components/SanityImage';
import { CtaPanel } from '@/components/sections/CtaPanel';
import { LabeledSection } from '@/components/sections/LabeledSection';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { CtaButton } from '@/components/ui/CtaButton';
import { DesignNote } from '@/components/ui/DesignNote';
import { Icon } from '@/components/ui/Icon';
import { UnderlineLink } from '@/components/ui/UnderlineLink';

const BASE = routes.leadership;
const SECTION = 'pb-14 lg:pb-24';
const AREA_COLUMNS = 2;

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  return slugParams(await getPersonSlugs(), params.locale);
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/partners/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const person = await getPersonBySlug(locale, slug);
  return detailPageMetadata(
    locale,
    BASE,
    person && {
      slug: person.slug,
      seo: person.seo,
      title: nameWithTitles(person.name, person.titles),
      description: localize(person.summary, locale) ?? localize(person.position, locale),
    },
  );
}

interface RowProps {
  label: string;
  value?: string;
  /** Shown dimmed while the value is still missing. */
  placeholder?: string;
  href?: string;
  /** Width of the key column on desktop. */
  keyWidth: string;
}

/** One ruled key / value row: side by side on desktop, stacked on phones. */
function DetailRow({ label, value, placeholder, href, keyWidth }: RowProps) {
  const text = value ?? placeholder;
  if (!text) return null;
  const valueClass = `text-[16px] leading-[19px] lg:text-[18px] lg:leading-[21px] ${
    value ? 'text-on-navy' : 'text-on-navy-2'
  }`;
  return (
    <div className="flex flex-col gap-1 border-t border-line-navy py-[14px] last:border-b lg:flex-row lg:gap-6 lg:py-4">
      <dt
        className={`text-[12px] leading-[14px] text-on-navy-2 lg:text-[14px] lg:leading-[21px] ${keyWidth}`}
      >
        {label}
      </dt>
      <dd className={valueClass}>
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

/**
 * Partner profile (Design.pen → Partner Profile · Desktop 1440 / Mobile 375): portrait and
 * identity with the contact rows, then About, Areas of work, Credentials, Other partners
 * and the CTA panel. Rows the partner has not supplied yet show "To be provided".
 */
export default async function PartnerPage({ params }: PageProps<'/[locale]/partners/[slug]'>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [person, settings, people] = await Promise.all([
    getPersonBySlug(locale, slug),
    getSiteSettings(),
    getPeople(),
  ]);
  if (!person) return redirectToLocalizedSlug(locale, slug, BASE, getPersonByAnySlug);

  const t = getDictionary(locale);
  const name = person.name ?? '';
  const position = localize(person.position, locale);
  const officeName = localize(person.office?.name, locale);
  const officeKind = localize(person.office?.kind, locale);
  const phone = person.office?.phone ?? settings?.phone;
  const listHref = localePath(locale, BASE);
  const profilePath = detailPath(locale, BASE, person.slug) ?? listHref;
  const contactHref = localePath(locale, routes.contact);
  const summary = localize(person.statement, locale) ?? localize(person.summary, locale);
  const bio = localize(person.bio, locale);
  const areas = (person.services ?? []).flatMap((service) => {
    const title = localize(service.title, locale);
    const href = detailPath(locale, routes.services, service.slug);
    return title && href ? [{ id: service._id, title, href }] : [];
  });
  const credentialsOf = (kind: string) =>
    (person.credentials ?? [])
      .filter((credential) => credential.kind === kind)
      .map((credential) => {
        const title = localize(credential.title, locale);
        return credential.year ? `${title} (${credential.year})` : title;
      })
      .filter(Boolean)
      .join(' · ') || undefined;
  const languages =
    (person.languages ?? []).map((code) => languageName(code, locale)).join(', ') || undefined;
  const others = people.filter((other) => other._id !== person._id);

  return (
    <>
      <JsonLd
        data={[
          personJsonLd({
            name,
            url: absoluteUrl(profilePath),
            jobTitle: position,
            email: person.email,
            image: person.photo,
            sameAs: [person.linkedin],
            organizationUrl: siteUrl.origin,
          }),
          breadcrumbJsonLd([
            { name: t.homeLabel, url: absoluteUrl(localePath(locale)) },
            { name: t.leadership, url: absoluteUrl(listHref) },
            { name, url: absoluteUrl(profilePath) },
          ]),
        ]}
      />
      <HeaderSpacer />
      <header className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-4 pb-12 pt-4 lg:gap-10 lg:px-5 lg:pb-24 lg:pt-14">
        <Breadcrumb
          label={t.breadcrumb}
          items={[{ label: t.leadership, href: listHref }, { label: name }]}
        />
        <div className="flex flex-col gap-5 lg:flex-row lg:gap-[60px]">
          <div className="h-[460px] shrink-0 overflow-hidden rounded-card bg-navy-800 lg:h-[700px] lg:w-[40%]">
            <SanityImage
              image={person.photo}
              locale={locale}
              sizes="(min-width: 1024px) 560px, 100vw"
              priority
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-5 lg:justify-between lg:gap-10">
            <div className="flex flex-col gap-5 lg:gap-6">
              <p className="text-[14px] leading-[17px] text-brass-light lg:text-[15px] lg:leading-[18px]">
                {[position, officeName].filter(Boolean).join(' · ')}
              </p>
              <h1 className="font-display text-[64px] leading-[67px] tracking-[-0.6px] text-on-navy lg:text-[min(7.222vw,104px)] lg:leading-[1.048]">
                {name}
              </h1>
              {person.titles && (
                <p className="font-serif text-[20px] leading-[25px] text-on-navy-2 lg:text-[28px] lg:leading-[35px]">
                  {person.titles}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-5 lg:gap-8">
              <dl className="flex flex-col">
                <DetailRow
                  label={t.partner.email}
                  value={person.email ?? undefined}
                  href={person.email ? `mailto:${person.email}` : undefined}
                  keyWidth="lg:w-[120px]"
                />
                <DetailRow
                  label={t.partner.phone}
                  value={phone ? fill(t.partner.firmPhone, { phone }) : undefined}
                  href={phone ? telHref(phone) : undefined}
                  keyWidth="lg:w-[120px]"
                />
                <DetailRow
                  label={t.partner.office}
                  value={[officeName, officeKind].filter(Boolean).join(' · ') || undefined}
                  keyWidth="lg:w-[120px]"
                />
              </dl>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-7">
                <CtaButton href={contactHref} className="justify-center lg:justify-start">
                  {fill(t.partner.contactCta, { name: firstName(name) })}
                </CtaButton>
                <UnderlineLink href={`${profilePath}/vcard`} size="touch" icon="download" download>
                  {t.partner.saveContact}
                </UnderlineLink>
              </div>
            </div>
          </div>
        </div>
      </header>

      {(summary || bio) && (
        <LabeledSection label={t.partner.about} spacing={SECTION}>
          <div className="flex flex-col gap-5 lg:gap-7">
            {summary && (
              <p className="font-display text-[30px] leading-[32px] text-on-navy lg:text-[min(3.056vw,44px)] lg:leading-[1.045]">
                {summary}
              </p>
            )}
            {bio ? (
              <PortableTextRenderer value={bio} className="max-w-[720px] gap-6 text-on-navy-2" />
            ) : (
              <DesignNote className="text-[14px] lg:text-[16px] lg:leading-[19px]">
                {t.partner.bioNote}
              </DesignNote>
            )}
          </div>
        </LabeledSection>
      )}

      {areas.length > 0 && (
        <LabeledSection label={t.partner.areasOfWork} spacing={SECTION} isHeadingOnMobile>
          <ul
            style={{ '--rows': Math.ceil(areas.length / AREA_COLUMNS) } as CSSProperties}
            className="grid grid-cols-1 lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-[repeat(var(--rows),auto)] lg:gap-x-10"
          >
            {areas.map((area) => (
              <li key={area.id} className="border-t border-line-navy max-lg:last:border-b">
                <Link
                  href={area.href}
                  className="flex items-center justify-between gap-4 py-[14px] font-serif text-[18px] leading-[21px] text-on-navy -outline-offset-2 transition-colors hover:text-brass-light lg:py-4 lg:text-[20px] lg:leading-[24px]"
                >
                  {area.title}
                  <Icon name="arrowUpRight" className="h-[18px] w-[18px] shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </LabeledSection>
      )}

      <LabeledSection label={t.partner.credentials} spacing={SECTION} isHeadingOnMobile>
        <dl className="flex flex-col">
          <DetailRow
            label={t.partner.qualifications}
            value={person.titles ?? undefined}
            placeholder={t.partner.toBeProvided}
            keyWidth="lg:w-[200px]"
          />
          <DetailRow
            label={t.credentialKinds.license ?? ''}
            value={credentialsOf('license')}
            placeholder={t.partner.toBeProvided}
            keyWidth="lg:w-[200px]"
          />
          <DetailRow
            label={t.credentialKinds.education ?? ''}
            value={credentialsOf('education')}
            placeholder={t.partner.toBeProvided}
            keyWidth="lg:w-[200px]"
          />
          {credentialsOf('certification') && (
            <DetailRow
              label={t.credentialKinds.certification ?? ''}
              value={credentialsOf('certification')}
              keyWidth="lg:w-[200px]"
            />
          )}
          <DetailRow
            label={t.partner.languages}
            value={languages}
            placeholder={t.partner.toBeProvided}
            keyWidth="lg:w-[200px]"
          />
        </dl>
      </LabeledSection>

      {others.length > 0 && (
        <LabeledSection label={t.partner.otherPartners} spacing={SECTION} isHeadingOnMobile>
          <ul className="flex flex-col gap-4 lg:flex-row lg:gap-6">
            {others.map((other) => (
              <li key={other._id} className="flex min-w-0 flex-1">
                <PartnerRowCard person={other} locale={locale} />
              </li>
            ))}
          </ul>
        </LabeledSection>
      )}

      <CtaPanel
        heading={fill(t.partner.ctaHeading, { name })}
        lead={t.partner.ctaLead}
        cta={{ label: t.bookConsultation, href: contactHref }}
        direct={[settings?.phone, settings?.email].filter(Boolean).join(' · ')}
      />
      <div aria-hidden="true" className="h-14 lg:h-20" />
    </>
  );
}
