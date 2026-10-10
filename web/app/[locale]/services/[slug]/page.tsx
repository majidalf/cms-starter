import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { detailPath, redirectToLocalizedSlug, slugParams } from '@/lib/collectionRoutes';
import { getDictionary, isLocale, localePath } from '@/lib/i18n';
import { detailPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import {
  getServiceByAnySlug,
  getServiceBySlug,
  getServiceSlugs,
  getServices,
} from '@/lib/sanity/collections/service';
import { localize } from '@/lib/sanity/localize';
import { getSiteSettings } from '@/lib/sanity/queries';
import { EntryList } from '@/components/collections/EntryList';
import { CtaPanel } from '@/components/collections/CtaPanel';
import { PageHeader } from '@/components/collections/PageHeader';
import { PersonList, visiblePeople } from '@/components/collections/PersonList';
import { RelatedBlock } from '@/components/collections/RelatedBlock';
import { RichText } from '@/components/collections/RichText';
import {
  caseStudyEntries,
  industryEntries,
  insightEntries,
} from '@/components/collections/entries';
import { Container } from '@/components/ui/Container';

const BASE = routes.services;

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  return slugParams(await getServiceSlugs(), params.locale);
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/services/[slug]'>): Promise<Metadata> {
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
 * Practice area detail (design/Design.pen -> Practice Area · Desktop 1440):
 * breadcrumb, "01 of 15" index, display H1 with lead, a numbered practice
 * nav beside the content, key contacts, related sectors, CTA panel and
 * previous/next links - all on navy-950.
 */
export default async function ServicePage({ params }: PageProps<'/[locale]/services/[slug]'>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [service, settings, allServices] = await Promise.all([
    getServiceBySlug(locale, slug),
    getSiteSettings(),
    getServices(),
  ]);
  if (!service) return redirectToLocalizedSlug(locale, slug, BASE, getServiceByAnySlug);

  const t = getDictionary(locale);
  const industries = industryEntries(service.industries ?? [], locale);
  const caseStudies = caseStudyEntries(service.caseStudies, locale);
  const insights = insightEntries(service.insights, locale);
  const keyContacts = visiblePeople(service.keyContacts ?? [], locale);

  const nav = allServices
    .map((item) => ({
      id: item._id,
      title: localize(item.title, locale),
      href: detailPath(locale, BASE, item.slug),
    }))
    .filter((item) => item.title && item.href);
  const position = nav.findIndex((item) => item.href === localePath(locale, `${BASE}/${slug}`));
  const total = nav.length;
  const index =
    position >= 0
      ? `${String(position + 1).padStart(2, '0')} ${t.practice.of} ${total}`
      : undefined;
  const previous = position > 0 ? nav[position - 1] : undefined;
  const next = position >= 0 && position < total - 1 ? nav[position + 1] : undefined;

  return (
    <div className="bg-navy-950 text-on-navy">
      <article className="pb-8">
        <PageHeader
          locale={locale}
          path={localePath(locale, `${BASE}/${slug}`)}
          title={localize(service.title, locale) ?? ''}
          intro={localize(service.summary, locale)}
          back={{ href: localePath(locale, BASE), label: t.services }}
          index={index}
        />
        <Container className="grid gap-12 lg:grid-cols-[280px_minmax(0,1fr)]">
          {nav.length > 1 && (
            <nav aria-label={t.services} className="lg:sticky lg:top-8 lg:self-start">
              <p className="pb-4 text-sm font-medium uppercase tracking-[0.18em] text-on-navy-2">
                <Link
                  href={localePath(locale, BASE)}
                  className="transition-colors hover:text-brass-light"
                >
                  {t.practice.allAreas}
                </Link>
              </p>
              <ol className="flex flex-col">
                {nav.map((item, order) => {
                  const isActive = order === position;
                  return (
                    <li key={item.id} className="border-b border-on-navy/15">
                      {isActive ? (
                        <span
                          aria-current="page"
                          className="flex items-baseline gap-4 py-3 font-serif text-lg text-brass-light"
                        >
                          <span aria-hidden="true" className="text-sm text-brass">
                            —
                          </span>
                          {item.title}
                        </span>
                      ) : (
                        <Link
                          href={item.href ?? ''}
                          className="flex items-baseline gap-4 py-3 font-serif text-lg text-on-navy transition-colors hover:text-brass-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                        >
                          <span aria-hidden="true" className="text-sm text-on-navy-2">
                            {String(order + 1).padStart(2, '0')}
                          </span>
                          {item.title}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}
          <div className="flex min-w-0 flex-col">
            <RichText value={localize(service.body, locale)} />
            <RelatedBlock title={t.keyContacts} isEmpty={keyContacts.length === 0}>
              <PersonList people={keyContacts} locale={locale} />
            </RelatedBlock>
            <RelatedBlock title={t.relatedIndustries} isEmpty={industries.length === 0}>
              <EntryList entries={industries} headingLevel="h3" />
            </RelatedBlock>
            <RelatedBlock title={t.relatedCaseStudies} isEmpty={caseStudies.length === 0}>
              <EntryList entries={caseStudies} headingLevel="h3" />
            </RelatedBlock>
            <RelatedBlock title={t.latestInsights} isEmpty={insights.length === 0}>
              <EntryList entries={insights} headingLevel="h3" />
            </RelatedBlock>
          </div>
        </Container>
        <CtaPanel
          title={t.practice.ctaHeading}
          lead={t.practice.ctaLead}
          email={settings?.email}
          phone={settings?.phone}
          contactHref={localePath(locale, routes.contact)}
          contactLabel={t.practice.contactCta}
        />
        {(previous || next) && (
          <Container className="flex flex-wrap items-center justify-between gap-4 pb-10">
            {previous?.href ? (
              <Link
                href={previous.href}
                className="inline-flex items-center gap-2 text-on-navy-2 transition-colors hover:text-brass-light"
              >
                <span aria-hidden="true">←</span> {t.previous}: {previous.title}
              </Link>
            ) : (
              <span />
            )}
            {next?.href && (
              <Link
                href={next.href}
                className="inline-flex items-center gap-2 text-on-navy-2 transition-colors hover:text-brass-light"
              >
                {t.next}: {next.title} <span aria-hidden="true">→</span>
              </Link>
            )}
          </Container>
        )}
      </article>
    </div>
  );
}
