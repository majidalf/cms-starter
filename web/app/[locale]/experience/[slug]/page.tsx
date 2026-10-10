import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { detailPath, redirectToLocalizedSlug, slugParams } from '@/lib/collectionRoutes';
import { getDictionary, isLocale, localePath } from '@/lib/i18n';
import { detailPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import {
  getCaseStudyByAnySlug,
  getCaseStudyBySlug,
  getCaseStudySlugs,
} from '@/lib/sanity/collections/caseStudy';
import { localize } from '@/lib/sanity/localize';
import { getSiteSettings } from '@/lib/sanity/queries';
import { PortableTextRenderer } from '@/components/PortableTextRenderer';
import { CtaPanel } from '@/components/sections/CtaPanel';
import { LabeledSection } from '@/components/sections/LabeledSection';
import { PageHeader } from '@/components/sections/PageHeader';
import { TagPill } from '@/components/ui/Pill';
import { UnderlineLink } from '@/components/ui/UnderlineLink';

const BASE = routes.caseStudies;
const SECTION = 'pb-14 lg:pb-24';

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  return slugParams(await getCaseStudySlugs(), params.locale);
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/experience/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const matter = await getCaseStudyBySlug(locale, slug);
  return detailPageMetadata(
    locale,
    BASE,
    matter && {
      slug: matter.slug,
      seo: matter.seo,
      title: localize(matter.title, locale),
      description: localize(matter.summary, locale),
    },
  );
}

/**
 * One matter. Design.pen has the Experience list but no frame for an entry, so this page is
 * composed from designed parts: the inner page header, labeled sections with article text,
 * tag pills and the CTA panel.
 */
export default async function MatterPage({ params }: PageProps<'/[locale]/experience/[slug]'>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [matter, settings] = await Promise.all([
    getCaseStudyBySlug(locale, slug),
    getSiteSettings(),
  ]);
  if (!matter) return redirectToLocalizedSlug(locale, slug, BASE, getCaseStudyByAnySlug);

  const t = getDictionary(locale);
  const listHref = localePath(locale, BASE);
  const title = localize(matter.title, locale) ?? '';
  const sections = [
    { label: t.experience.challenge, body: localize(matter.challenge, locale) },
    { label: t.experience.approach, body: localize(matter.approach, locale) },
    { label: t.experience.outcome, body: localize(matter.outcome, locale) },
  ].filter((section) => section.body && section.body.length > 0);
  const services = (matter.services ?? []).flatMap((service) => {
    const label = localize(service.title, locale);
    const href = detailPath(locale, routes.services, service.slug);
    return label && href ? [{ id: service._id, label, href }] : [];
  });
  const sectors = (matter.industries ?? []).flatMap((industry) => {
    const label = localize(industry.title, locale);
    return label ? [{ id: industry._id, label }] : [];
  });

  return (
    <>
      <PageHeader
        breadcrumbLabel={t.breadcrumb}
        breadcrumb={[{ label: t.caseStudies, href: listHref }, { label: title }]}
        label={[matter.year, localize(matter.client, locale)].filter(Boolean).join(' · ')}
        title={title}
        titleSize="sm"
        lead={localize(matter.summary, locale)}
        spacing="pb-10 lg:pb-[72px]"
      />
      {sections.map((section) => (
        <LabeledSection
          key={section.label}
          label={section.label}
          spacing={SECTION}
          isHeadingOnMobile
        >
          <PortableTextRenderer
            value={section.body}
            className="max-w-[720px] gap-6 text-on-navy-2"
          />
        </LabeledSection>
      ))}
      {(services.length > 0 || sectors.length > 0) && (
        <LabeledSection label={t.services} spacing={SECTION}>
          <ul className="flex flex-wrap gap-2">
            {services.map((service) => (
              <li key={service.id} className="flex">
                <Link href={service.href} className="group flex rounded-full">
                  <TagPill size="md" className="transition-colors group-hover:text-brass-light">
                    {service.label}
                  </TagPill>
                </Link>
              </li>
            ))}
            {sectors.map((sector) => (
              <li key={sector.id} className="flex">
                <TagPill size="md">{sector.label}</TagPill>
              </li>
            ))}
          </ul>
        </LabeledSection>
      )}
      <CtaPanel
        heading={t.about.ctaHeading}
        lead={t.about.ctaLead}
        cta={{ label: t.bookConsultation, href: localePath(locale, routes.contact) }}
        direct={[settings?.phone, settings?.email].filter(Boolean).join(' · ')}
      />
      <nav
        aria-label={t.caseStudies}
        className="relative mx-auto flex w-full max-w-[1440px] px-4 pb-14 pt-8 lg:px-5 lg:pb-[100px] lg:pt-10"
      >
        <UnderlineLink href={listHref} size="touch" icon="arrowUpRight">
          {t.experience.allMatters}
        </UnderlineLink>
      </nav>
    </>
  );
}
