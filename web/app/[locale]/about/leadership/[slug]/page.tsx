import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { redirectToLocalizedSlug, slugParams } from '@/lib/collectionRoutes';
import { getDictionary, isLocale, languageName, localePath } from '@/lib/i18n';
import { personJsonLd } from '@/lib/jsonLd';
import { safeHref } from '@/lib/links';
import { detailPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import {
  getPeople,
  getPersonByAnySlug,
  getPersonBySlug,
  getPersonSlugs,
} from '@/lib/sanity/collections/person';
import { localize } from '@/lib/sanity/localize';
import { getSiteSettings } from '@/lib/sanity/queries';
import { EntryList } from '@/components/collections/EntryList';
import { PageHeader } from '@/components/collections/PageHeader';
import { PersonList, visiblePeople } from '@/components/collections/PersonList';
import { RelatedBlock } from '@/components/collections/RelatedBlock';
import { CtaPanel } from '@/components/collections/CtaPanel';
import { insightEntries, serviceEntries } from '@/components/collections/entries';
import { PortableTextRenderer } from '@/components/PortableTextRenderer';
import { JsonLd } from '@/components/JsonLd';
import { SanityImage } from '@/components/SanityImage';
import { absoluteUrl, siteUrl } from '@/lib/site';
import { Container } from '@/components/ui/Container';

const BASE = routes.leadership;
const CREDENTIAL_KINDS = ['education', 'certification', 'license'] as const;

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  return slugParams(await getPersonSlugs(), params.locale);
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/about/leadership/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const person = await getPersonBySlug(locale, slug);
  return detailPageMetadata(
    locale,
    BASE,
    person && {
      slug: person.slug,
      seo: person.seo,
      title: person.name ?? undefined,
      description: localize(person.position, locale),
    },
  );
}

/**
 * Partner profile (design/Design.pen -> Partner Profile · Desktop 1440):
 * breadcrumb, portrait beside the identity, contact facts, areas of work,
 * credentials, other partners and a closing CTA - all on navy-950.
 */
export default async function PersonPage({
  params,
}: PageProps<'/[locale]/about/leadership/[slug]'>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const person = await getPersonBySlug(locale, slug);
  if (!person) return redirectToLocalizedSlug(locale, slug, BASE, getPersonByAnySlug);

  const [settings, everyone] = await Promise.all([getSiteSettings(), getPeople()]);
  const t = getDictionary(locale);
  const profilePath = localePath(locale, `${BASE}/${slug}`);
  const linkedin = safeHref(person.linkedin);
  const services = serviceEntries(person.services ?? [], locale);
  const insights = insightEntries(person.insights, locale);
  const credentialGroups = CREDENTIAL_KINDS.map((kind) => ({
    kind,
    items: (person.credentials ?? []).filter((credential) => credential.kind === kind),
  })).filter(({ items }) => items.length > 0);
  const languages = (person.languages ?? []).map((code) => languageName(code, locale));
  const candidates = visiblePeople(
    everyone.filter((candidate) => candidate._id !== person._id),
    locale,
  );
  const otherPartners = [
    ...candidates.filter((candidate) => candidate.group === person.group),
    ...candidates.filter((candidate) => candidate.group !== person.group),
  ].slice(0, 3);

  const structuredData = personJsonLd({
    name: person.name ?? '',
    url: absoluteUrl(profilePath),
    jobTitle: localize(person.position, locale),
    email: person.email,
    image: person.photo,
    sameAs: [linkedin],
    organizationUrl: siteUrl.origin,
  });

  return (
    <div className="bg-navy-950 text-on-navy">
      <article className="pb-8">
        <JsonLd data={structuredData} />
        <PageHeader
          locale={locale}
          path={localePath(locale, `${BASE}/${slug}`)}
          title={person.name ?? ''}
          eyebrow={
            localize(person.position, locale) ??
            (person.group ? t.personGroups[person.group] : undefined)
          }
          back={{
            href: localePath(locale, BASE),
            label: person.group ? (t.personGroups[person.group] ?? t.leadership) : t.leadership,
          }}
        />
        <Container className="grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="flex flex-col gap-6">
            <SanityImage
              image={person.photo}
              locale={locale}
              sizes="(min-width: 768px) 40vw, 100vw"
              className="aspect-[4/5] w-full rounded-photo object-cover"
              priority
            />
            <dl className="flex flex-col gap-4 border-t border-on-navy/15 pt-6 text-sm">
              {person.email && (
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 text-on-navy-2">{t.email}</dt>
                  <dd>
                    <a
                      href={`mailto:${person.email}`}
                      className="text-on-navy underline underline-offset-2 hover:text-brass-light"
                    >
                      {person.email}
                    </a>
                  </dd>
                </div>
              )}
              {settings?.phone && (
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 text-on-navy-2">{t.phone}</dt>
                  <dd className="text-on-navy">
                    {settings.phone} {t.partner.firmPhoneNote}
                  </dd>
                </div>
              )}
              {person.office && (
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 text-on-navy-2">{t.office}</dt>
                  <dd className="text-on-navy">{localize(person.office.name, locale)}</dd>
                </div>
              )}
              {languages.length > 0 && (
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 text-on-navy-2">{t.languagesSpoken}</dt>
                  <dd className="text-on-navy">{languages.join(', ')}</dd>
                </div>
              )}
            </dl>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <a
                  href={`${profilePath}/vcard`}
                  className="text-on-navy underline underline-offset-2 hover:text-brass-light"
                >
                  {t.saveContact}
                </a>
              </li>
              {linkedin && (
                <li>
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-on-navy underline underline-offset-2 hover:text-brass-light"
                  >
                    LinkedIn
                  </a>
                </li>
              )}
            </ul>
          </div>
          <div className="flex min-w-0 flex-col">
            <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-on-navy-2">
              {t.partner.about}
            </h2>
            <div className="prose prose-lg max-w-none pt-6 prose-invert prose-headings:font-serif prose-headings:font-normal prose-headings:text-on-navy prose-a:text-brass-light prose-a:underline-offset-4 hover:prose-a:text-brass prose-strong:text-on-navy">
              <PortableTextRenderer value={localize(person.bio, locale)} />
            </div>
          </div>
        </Container>
        <RelatedBlock title={t.partner.areasOfWork} isEmpty={services.length === 0}>
          <EntryList entries={services} headingLevel="h3" />
        </RelatedBlock>
        <RelatedBlock
          title={t.partner.credentials}
          isEmpty={credentialGroups.length === 0 && languages.length === 0}
        >
          <dl className="grid gap-x-10 gap-y-6 md:grid-cols-2">
            {credentialGroups.map(({ kind, items }) => (
              <div key={kind} className="flex flex-col gap-2">
                <dt className="text-sm uppercase tracking-wide text-on-navy-2">
                  {t.credentialKinds[kind]}
                </dt>
                <dd>
                  <ul className="flex flex-col gap-1.5 text-on-navy">
                    {items.map((credential) => (
                      <li key={credential._key}>
                        {localize(credential.title, locale)}
                        {credential.year && (
                          <span className="text-on-navy-2"> ({credential.year})</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </RelatedBlock>
        <RelatedBlock title={t.partner.otherPartners} isEmpty={otherPartners.length === 0}>
          <PersonList people={otherPartners} locale={locale} />
        </RelatedBlock>
        <RelatedBlock title={t.latestInsights} isEmpty={insights.length === 0}>
          <EntryList entries={insights} headingLevel="h3" />
        </RelatedBlock>
        <CtaPanel
          title={`${t.partner.speakWith} ${person.name}.`}
          lead={t.practice.ctaLead}
          email={person.email ?? settings?.email}
          phone={settings?.phone}
          contactHref={localePath(locale, routes.contact)}
          contactLabel={t.practice.contactCta}
        />
      </article>
    </div>
  );
}
