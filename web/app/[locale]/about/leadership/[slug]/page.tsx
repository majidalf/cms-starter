import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { redirectToLocalizedSlug, slugParams } from '@/lib/collectionRoutes';
import { getDictionary, isLocale, languageName, localePath } from '@/lib/i18n';
import { safeHref } from '@/lib/links';
import { detailPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import {
  getPersonByAnySlug,
  getPersonBySlug,
  getPersonSlugs,
} from '@/lib/sanity/collections/person';
import { localize } from '@/lib/sanity/localize';
import { EntryList } from '@/components/collections/EntryList';
import { PageHeader } from '@/components/collections/PageHeader';
import { RelatedBlock } from '@/components/collections/RelatedBlock';
import { insightEntries, serviceEntries } from '@/components/collections/entries';
import { PortableTextRenderer } from '@/components/PortableTextRenderer';
import { SanityImage } from '@/components/SanityImage';
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

export default async function PersonPage({
  params,
}: PageProps<'/[locale]/about/leadership/[slug]'>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const person = await getPersonBySlug(locale, slug);
  if (!person) return redirectToLocalizedSlug(locale, slug, BASE, getPersonByAnySlug);

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

  return (
    <article className="pb-16">
      <PageHeader
        title={person.name ?? ''}
        eyebrow={person.group ? t.personGroups[person.group] : undefined}
        intro={localize(person.position, locale)}
        back={{ href: localePath(locale, BASE), label: t.leadership }}
      />
      <Container className="grid gap-10 md:grid-cols-[minmax(0,1fr)_2fr]">
        <div className="flex flex-col gap-6">
          <SanityImage
            image={person.photo}
            locale={locale}
            sizes="(min-width: 768px) 33vw, 100vw"
            className="aspect-[4/5] w-full object-cover"
            priority
          />
          <dl className="flex flex-col gap-4 text-sm">
            {person.email && (
              <div>
                <dt className="text-muted">{t.email}</dt>
                <dd>
                  <a href={`mailto:${person.email}`} className="underline underline-offset-2">
                    {person.email}
                  </a>
                </dd>
              </div>
            )}
            {person.office && (
              <div>
                <dt className="text-muted">{t.office}</dt>
                <dd>{localize(person.office.name, locale)}</dd>
              </div>
            )}
            {languages.length > 0 && (
              <div>
                <dt className="text-muted">{t.languagesSpoken}</dt>
                <dd>{languages.join(', ')}</dd>
              </div>
            )}
          </dl>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <a href={`${profilePath}/vcard`} className="underline underline-offset-2">
                {t.saveContact}
              </a>
            </li>
            {linkedin && (
              <li>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  LinkedIn
                </a>
              </li>
            )}
          </ul>
        </div>
        <div className="flex flex-col">
          <div className="prose prose-lg max-w-none">
            <PortableTextRenderer value={localize(person.bio, locale)} />
          </div>
          {credentialGroups.map(({ kind, items }) => (
            <section key={kind} className="flex flex-col gap-3 py-6">
              <h2 className="font-serif text-2xl text-brand">{t.credentialKinds[kind]}</h2>
              <ul className="flex flex-col gap-1">
                {items.map((credential) => (
                  <li key={credential._key}>
                    {localize(credential.title, locale)}
                    {credential.year && <span className="text-muted"> ({credential.year})</span>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Container>
      <RelatedBlock title={t.services} isEmpty={services.length === 0}>
        <EntryList entries={services} headingLevel="h3" />
      </RelatedBlock>
      <RelatedBlock title={t.latestInsights} isEmpty={insights.length === 0}>
        <EntryList entries={insights} headingLevel="h3" />
      </RelatedBlock>
    </article>
  );
}
