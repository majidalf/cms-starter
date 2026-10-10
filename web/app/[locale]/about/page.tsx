import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary, isLocale, localePath } from '@/lib/i18n';
import { listPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import { getIndustries } from '@/lib/sanity/collections/industry';
import { getOffices } from '@/lib/sanity/collections/office';
import { getPeople } from '@/lib/sanity/collections/person';
import { getServices } from '@/lib/sanity/collections/service';
import { getSiteSettings } from '@/lib/sanity/queries';
import { CtaPanel } from '@/components/collections/CtaPanel';
import { PageHeader } from '@/components/collections/PageHeader';
import { PersonList } from '@/components/collections/PersonList';
import { Container } from '@/components/ui/Container';
import { showcasePeople } from '@/components/sections/PartnersSection';

export function generateMetadata({ params }: PageProps<'/[locale]/about'>) {
  return listPageMetadata(params, routes.about, (t) => t.about.title);
}

/**
 * About (design/Design.pen -> About · Desktop 1440): breadcrumb header,
 * "Who we are" statement, four working principles, computed facts, partners
 * on a paper panel, commitment and a closing CTA - all on navy-950.
 */
export default async function AboutPage({ params }: PageProps<'/[locale]/about'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const [settings, services, industries, offices, people] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getIndustries(),
    getOffices(),
    getPeople(),
  ]);
  const partners = showcasePeople(people, locale);
  const facts = [
    { label: t.home.factsPractices, value: String(services.length) },
    { label: t.home.factsSectors, value: String(industries.length) },
    { label: t.home.factsOffices, value: String(offices.length) },
    { label: t.home.factsLanguages, value: t.home.factsLanguagesValue },
  ];

  return (
    <div className="bg-navy-950 text-on-navy">
      <PageHeader
        locale={locale}
        path={localePath(locale, routes.about)}
        title={t.about.heading}
        eyebrow={t.about.eyebrow}
      />

      <section aria-labelledby="who-we-are" className="py-12 md:py-16">
        <Container className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <h2
            id="who-we-are"
            className="text-sm font-medium uppercase tracking-[0.18em] text-on-navy-2"
          >
            {t.about.whoWeAre}
          </h2>
          <div className="flex flex-col gap-8">
            <p className="max-w-3xl font-serif text-2xl leading-snug text-on-navy md:text-3xl">
              {t.about.statement}
            </p>
            <div className="grid gap-8 border-t border-on-navy/15 pt-8 md:grid-cols-2">
              <p className="leading-relaxed text-on-navy-2">{t.about.p1}</p>
              <p className="leading-relaxed text-on-navy-2">{t.about.p2}</p>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="how-we-work" className="py-12 md:py-16">
        <Container className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <h2
            id="how-we-work"
            className="text-sm font-medium uppercase tracking-[0.18em] text-on-navy-2"
          >
            {t.about.howWeWork}
          </h2>
          <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {t.about.principles.map((principle) => (
              <li
                key={principle.title}
                className="flex flex-col gap-2 border-t border-on-navy/15 pt-5"
              >
                <h3 className="font-serif text-xl text-on-navy">{principle.title}</h3>
                <p className="text-sm leading-relaxed text-on-navy-2">{principle.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-label={t.home.aboutEyebrow} className="py-12 md:py-16">
        <Container>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-on-navy/15 pt-8 lg:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-1">
                <dt className="order-2 text-sm text-on-navy-2">{fact.label}</dt>
                <dd className="order-1 font-display text-4xl text-on-navy md:text-5xl">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {partners.length > 0 && (
        <section aria-labelledby="about-partners" className="py-12 md:py-16">
          <Container>
            <div className="grid gap-10 rounded-panel bg-paper p-8 text-navy-900 md:p-12 lg:grid-cols-[280px_minmax(0,1fr)]">
              <div className="flex flex-col items-start gap-4 lg:sticky lg:top-8 lg:self-start">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-bronze">
                  {t.home.partnersEyebrow}
                </p>
                <h2
                  id="about-partners"
                  className="font-display text-4xl leading-tight tracking-tight text-balance"
                >
                  {t.about.partnersHeading}
                </h2>
                <p className="text-sm leading-relaxed text-ink-2">{t.about.partnersEyebrow}</p>
                <Link
                  href={localePath(locale, routes.leadership)}
                  className="inline-flex items-center gap-2 border-b border-navy-900/40 pb-1 text-base font-medium transition-colors hover:border-bronze hover:text-bronze focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
                >
                  {t.home.viewAll}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
              <PersonList people={partners} locale={locale} tone="light" />
            </div>
          </Container>
        </section>
      )}

      <section aria-labelledby="commitment" className="py-12 md:py-16">
        <Container>
          <div className="flex flex-col gap-5 rounded-panel bg-navy-800 p-8 md:p-12">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-on-navy-2">
              {t.about.commitmentLabel}
            </p>
            <p className="max-w-3xl font-display text-3xl leading-tight tracking-tight text-balance text-on-navy md:text-4xl">
              {t.about.commitmentStatement}
            </p>
            <p className="max-w-2xl leading-relaxed text-on-navy-2">{t.about.commitmentText}</p>
          </div>
        </Container>
      </section>

      <CtaPanel
        title={t.about.ctaHeading}
        lead={t.about.ctaLead}
        email={settings?.email}
        phone={settings?.phone}
        contactHref={localePath(locale, routes.contact)}
        contactLabel={t.practice.contactCta}
      />
      <div className="pb-8" />
    </div>
  );
}
