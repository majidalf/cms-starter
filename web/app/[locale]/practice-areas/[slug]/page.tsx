import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { detailPath, redirectToLocalizedSlug, slugParams } from '@/lib/collectionRoutes';
import { fill, getDictionary, isLocale, localePath } from '@/lib/i18n';
import { detailPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import {
  getServiceByAnySlug,
  getServiceBySlug,
  getServiceSlugs,
  getServices,
} from '@/lib/sanity/collections/service';
import { localize, localizeList } from '@/lib/sanity/localize';
import { getSiteSettings } from '@/lib/sanity/queries';
import { PartnerCard } from '@/components/partners/PartnerCard';
import { CtaPanel } from '@/components/sections/CtaPanel';
import { PageHeader } from '@/components/sections/PageHeader';
import { DesignNote } from '@/components/ui/DesignNote';
import { CitationPill, TagPill } from '@/components/ui/Pill';
import { UnderlineLink } from '@/components/ui/UnderlineLink';

const BASE = routes.services;
const DIGITS = 2;
/** Mobile shows a short list of other areas, then a link to all of them. */
const MOBILE_LIST_LENGTH = 5;
const H2 = 'font-display text-[32px] leading-[34px] text-on-navy lg:text-[40px] lg:leading-[42px]';

const pad = (value: number) => String(value).padStart(DIGITS, '0');

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  return slugParams(await getServiceSlugs(), params.locale);
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/practice-areas/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const service = await getServiceBySlug(locale, slug);
  return detailPageMetadata(
    locale,
    BASE,
    service && {
      slug: service.slug,
      seo: service.seo,
      title: localize(service.title, locale),
      description: localize(service.summary, locale),
    },
  );
}

/**
 * Practice area (Design.pen → Practice Area · Desktop 1440 / Mobile 375): header with
 * "01 of 15"; on desktop the list of all areas runs down the first third while the content
 * (what we handle, legal basis, who to contact, sectors) fills the rest; then the CTA panel
 * and the back / next links. Sections without content are left out.
 */
export default async function PracticeAreaPage({
  params,
}: PageProps<'/[locale]/practice-areas/[slug]'>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [service, settings, allServices] = await Promise.all([
    getServiceBySlug(locale, slug),
    getSiteSettings(),
    getServices(),
  ]);
  if (!service) return redirectToLocalizedSlug(locale, slug, BASE, getServiceByAnySlug);

  const t = getDictionary(locale);
  const title = localize(service.title, locale) ?? '';
  const listHref = localePath(locale, BASE);
  const contactHref = localePath(locale, routes.contact);
  const areas = allServices.flatMap((item) => {
    const areaTitle = localize(item.title, locale);
    const href = detailPath(locale, BASE, item.slug);
    return areaTitle && href ? [{ id: item._id, title: areaTitle, href }] : [];
  });
  const position = areas.findIndex((area) => area.id === service._id);
  const next = areas[(position + 1) % areas.length];
  const scope = localizeList(service.scope, locale);
  const citations = localizeList(service.legalBasis, locale);
  const contacts = service.keyContacts ?? [];
  const sectors = localizeList(
    (service.industries ?? []).map((industry) => industry.title),
    locale,
  );
  const direct = [settings?.phone, settings?.email].filter(Boolean).join(' · ');

  return (
    <>
      <PageHeader
        breadcrumbLabel={t.breadcrumb}
        breadcrumb={[{ label: t.services, href: listHref }, { label: title }]}
        label={fill(t.practice.of, { n: pad(position + 1), total: areas.length })}
        title={title}
        titleSize="lg"
        lead={localize(service.summary, locale)}
      />
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col px-4 lg:flex-row lg:items-start lg:px-5 lg:pb-[120px]">
        <nav
          aria-label={t.practice.allAreas}
          className="hidden w-1/3 shrink-0 flex-col gap-1 pr-12 lg:sticky lg:top-28 lg:flex"
        >
          <p className="text-[13px] leading-[15px] text-on-navy-2">{t.practice.allAreas}</p>
          <ol className="flex flex-col border-t border-line-navy">
            {areas.map((area, index) => {
              const isCurrent = area.id === service._id;
              return (
                <li key={area.id} className="border-b border-line-navy">
                  <Link
                    href={area.href}
                    aria-current={isCurrent ? 'page' : undefined}
                    className={`flex gap-[14px] py-[10px] -outline-offset-2 transition-colors hover:text-brass-light ${
                      isCurrent ? 'text-brass-light' : 'text-on-navy'
                    }`}
                  >
                    <span
                      className={`text-[13px] leading-[18px] ${isCurrent ? '' : 'text-on-navy-2'}`}
                    >
                      {pad(index + 1)}
                    </span>
                    <span
                      className={`text-[16px] leading-[18px] ${isCurrent ? 'font-medium' : ''}`}
                    >
                      {area.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
        <div className="flex min-w-0 flex-1 flex-col gap-14 pb-14 lg:gap-[72px] lg:pb-0">
          {scope.length > 0 && (
            <section className="flex flex-col gap-5 lg:gap-6">
              <h2 className={H2}>{t.practice.whatWeHandle}</h2>
              <ol className="flex flex-col border-b border-line-navy">
                {scope.map((item, index) => (
                  <li
                    key={item}
                    className="flex gap-4 border-t border-line-navy py-4 lg:gap-6 lg:py-[17.5px]"
                  >
                    <span className="w-7 shrink-0 text-[13px] leading-[24px] text-on-navy-2 lg:w-10 lg:leading-[28px]">
                      {pad(index + 1)}
                    </span>
                    <span className="flex-1 text-[17px] leading-[24px] text-on-navy lg:text-[20px] lg:leading-[28px]">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}
          {citations.length > 0 && (
            <section className="flex flex-col gap-4 lg:gap-5">
              <h2 className={H2}>{t.practice.legalBasis}</h2>
              <ul className="flex flex-wrap gap-2">
                {citations.map((citation) => (
                  <li key={citation} className="flex">
                    <CitationPill>{citation}</CitationPill>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {contacts.length > 0 && (
            <section className="flex flex-col gap-5 lg:gap-6">
              <h2 className={H2}>{t.practice.whoToContact}</h2>
              <ul className="flex flex-col gap-4">
                {contacts.map((person) => (
                  <li key={person._id}>
                    <PartnerCard
                      person={person}
                      locale={locale}
                      photoNote={t.practice.photoNote}
                      profileLabel={t.viewProfile}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
          {sectors.length > 0 && (
            <section className="flex flex-col gap-4 lg:gap-5">
              <h2 className={H2}>{t.practice.sectors}</h2>
              <ul className="flex flex-wrap gap-2">
                {sectors.map((sector) => (
                  <li key={sector} className="flex">
                    <TagPill size="md" className="max-lg:text-[13px] max-lg:leading-[15px]">
                      {sector}
                    </TagPill>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className="flex flex-col gap-4 lg:hidden">
            <h2 className={H2}>{t.practice.allAreas}</h2>
            <ol className="flex flex-col border-b border-line-navy">
              {areas.slice(0, MOBILE_LIST_LENGTH).map((area, index) => (
                <li key={area.id} className="border-t border-line-navy">
                  <Link
                    href={area.href}
                    aria-current={area.id === service._id ? 'page' : undefined}
                    className={`flex gap-3 py-[14px] -outline-offset-2 ${
                      area.id === service._id ? 'text-brass-light' : 'text-on-navy'
                    }`}
                  >
                    <span className="w-7 shrink-0 text-[13px] leading-[22px] text-on-navy-2">
                      {pad(index + 1)}
                    </span>
                    <span className="flex-1 text-[16px] leading-[22px]">{area.title}</span>
                  </Link>
                </li>
              ))}
            </ol>
            <UnderlineLink href={listHref} size="md" icon="arrowUpRight">
              {fill(t.seeAllPracticeAreas, { n: areas.length })}
            </UnderlineLink>
          </section>
          <DesignNote className="max-lg:text-[12px]">{t.practice.draftNote}</DesignNote>
        </div>
      </div>
      <div aria-hidden="true" className="h-8 lg:hidden" />
      <CtaPanel
        heading={t.practice.ctaHeading}
        lead={t.practice.ctaLead}
        cta={{ label: t.bookConsultation, href: contactHref }}
        direct={direct}
      />
      <nav
        aria-label={t.services}
        className="relative mx-auto hidden w-full max-w-[1440px] items-center justify-between px-5 pb-[100px] pt-10 lg:flex"
      >
        <UnderlineLink href={listHref} icon="arrowUpRight">
          {t.practice.allAreas}
        </UnderlineLink>
        {next && next.id !== service._id && (
          <Link
            href={next.href}
            className="text-[18px] leading-[21px] text-on-navy transition-colors hover:text-brass-light"
          >
            {t.practice.nextLabel} {pad(areas.indexOf(next) + 1)} · {next.title}{' '}
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </nav>
      <div aria-hidden="true" className="h-14 lg:hidden" />
    </>
  );
}
