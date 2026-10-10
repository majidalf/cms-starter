import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary, isLocale, localePath } from '@/lib/i18n';
import { listPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import { getIndustries } from '@/lib/sanity/collections/industry';
import { getOffices } from '@/lib/sanity/collections/office';
import { getPeople } from '@/lib/sanity/collections/person';
import { getServices } from '@/lib/sanity/collections/service';
import { getSiteSettings } from '@/lib/sanity/queries';
import { PartnersPanel } from '@/components/partners/PartnersPanel';
import { CtaPanel } from '@/components/sections/CtaPanel';
import { Facts } from '@/components/sections/Facts';
import { LabeledSection } from '@/components/sections/LabeledSection';
import { PageHeader } from '@/components/sections/PageHeader';

export function generateMetadata({ params }: PageProps<'/[locale]/about'>): Promise<Metadata> {
  return listPageMetadata(params, routes.about, (t) => t.about.title);
}

const SECTION = 'pb-14 lg:pb-28';

/**
 * About (Design.pen → About · Desktop 1440 / Mobile 375): header, Who we are, How we work
 * (four ruled principles), the fact cards, the partners panel, Our commitment and the CTA
 * panel. The copy is fixed text (dictionary → about); the numbers and partners come from
 * the CMS.
 */
export default async function AboutPage({ params }: PageProps<'/[locale]/about'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [settings, services, industries, people, offices] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getIndustries(),
    getPeople(),
    getOffices(),
  ]);
  const t = getDictionary(locale);
  const about = t.about;

  return (
    <>
      <PageHeader
        breadcrumbLabel={t.breadcrumb}
        breadcrumb={[{ label: t.homeLabel, href: localePath(locale) }, { label: about.title }]}
        label={about.label}
        title={about.heading}
      />
      <LabeledSection label={about.whoWeAre} spacing={SECTION}>
        <div className="flex flex-col gap-6 lg:gap-10">
          <p className="font-display text-[28px] leading-[31px] tracking-[-0.3px] text-on-navy lg:text-[min(3.056vw,44px)] lg:leading-[1.045] lg:tracking-normal">
            {about.statement}
          </p>
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
            {[about.p1, about.p2].map((paragraph) => (
              <p
                key={paragraph}
                className="flex-1 text-[16px] leading-[26px] text-on-navy-2 lg:text-[17px] lg:leading-[27px]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </LabeledSection>
      <LabeledSection label={about.howWeWork} spacing={SECTION} isHeadingOnMobile>
        <ul className="flex flex-col border-b border-line-navy">
          {about.principles.map((principle) => (
            <li
              key={principle.title}
              className="flex flex-col gap-2 border-t border-line-navy py-5 lg:flex-row lg:gap-10 lg:py-6"
            >
              <h3 className="font-serif text-[24px] leading-[28px] text-on-navy lg:w-[380px] lg:shrink-0 lg:font-display lg:text-[28px] lg:leading-[29px]">
                {principle.title}
              </h3>
              <p className="flex-1 text-[16px] leading-[24px] text-on-navy-2 lg:text-[18px] lg:leading-[27px]">
                {principle.text}
              </p>
            </li>
          ))}
        </ul>
      </LabeledSection>
      <section className={`relative mx-auto w-full max-w-[1440px] px-4 lg:px-5 ${SECTION}`}>
        <Facts
          locale={locale}
          practiceAreaCount={services.length}
          partnerNames={people.flatMap((person) => (person.name ? [person.name] : []))}
          officeCount={offices.length}
          sectorCount={industries.length}
        />
      </section>
      <PartnersPanel people={people} locale={locale} inset="page" id="partners" />
      <div aria-hidden="true" className="h-11 lg:h-28" />
      <section className="relative mx-auto w-full max-w-[1440px] px-3 pb-3 lg:px-5 lg:pb-5">
        <div className="flex flex-col gap-5 rounded-panel bg-navy-800 p-6 lg:flex-row lg:gap-10 lg:p-12">
          <h2 className="text-[14px] leading-[17px] text-on-navy-2 lg:w-[419px] lg:max-w-[32%] lg:shrink-0">
            {about.commitmentLabel}
          </h2>
          <div className="flex flex-1 flex-col gap-5 lg:gap-6">
            <p className="font-display text-[28px] leading-[31px] tracking-[-0.3px] text-on-navy lg:text-[min(3.333vw,48px)] lg:leading-[1.042] lg:tracking-[-0.6px]">
              {about.commitmentStatement}
            </p>
            <p className="text-[16px] leading-[24px] text-on-navy-2 lg:max-w-[640px] lg:text-[18px] lg:leading-[27px]">
              {about.commitmentText}
            </p>
          </div>
        </div>
      </section>
      <div aria-hidden="true" className="lg:h-4" />
      <CtaPanel
        heading={about.ctaHeading}
        lead={about.ctaLead}
        cta={{ label: t.bookConsultation, href: localePath(locale, routes.contact) }}
        direct={[settings?.phone, settings?.email].filter(Boolean).join(' · ')}
      />
      <div aria-hidden="true" className="h-14 lg:h-20" />
    </>
  );
}
