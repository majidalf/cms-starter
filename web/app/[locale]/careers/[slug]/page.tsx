import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { redirectToLocalizedSlug, slugParams } from '@/lib/collectionRoutes';
import { formatDate, getDictionary, isLocale, localePath } from '@/lib/i18n';
import { safeHref } from '@/lib/links';
import { detailPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import {
  getJobOpeningByAnySlug,
  getJobOpeningBySlug,
  getJobOpeningSlugs,
} from '@/lib/sanity/collections/jobOpening';
import { localize } from '@/lib/sanity/localize';
import { PageHeader } from '@/components/collections/PageHeader';
import { RichText } from '@/components/collections/RichText';
import { Container } from '@/components/ui/Container';

const BASE = routes.careers;

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  return slugParams(await getJobOpeningSlugs(), params.locale);
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/careers/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const opening = await getJobOpeningBySlug(locale, slug);
  return detailPageMetadata(
    locale,
    BASE,
    opening && { slug: opening.slug, seo: opening.seo, title: localize(opening.title, locale) },
  );
}

export default async function JobOpeningPage({ params }: PageProps<'/[locale]/careers/[slug]'>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const opening = await getJobOpeningBySlug(locale, slug);
  if (!opening) return redirectToLocalizedSlug(locale, slug, BASE, getJobOpeningByAnySlug);

  const t = getDictionary(locale);
  const deadline = formatDate(opening.deadline, locale);
  const applyHref = safeHref(opening.applyUrl);
  const isMailto = applyHref?.toLowerCase().startsWith('mailto:') ?? false;
  const facts = [
    { label: t.location, value: localize(opening.location, locale) },
    {
      label: t.employmentType,
      value: opening.employmentType ? t.employmentTypes[opening.employmentType] : undefined,
    },
    { label: t.deadline, value: deadline },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

  return (
    <div className="bg-navy-950 text-on-navy">
      <article className="pb-16">
        <PageHeader
          locale={locale}
          path={localePath(locale, `${BASE}/${slug}`)}
          title={localize(opening.title, locale) ?? ''}
          back={{ href: localePath(locale, BASE), label: t.careers }}
        >
          <dl className="flex flex-wrap gap-x-10 gap-y-2 text-sm">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-on-navy-2">{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </PageHeader>
        <RichText value={localize(opening.description, locale)} />
        {applyHref && (
          <Container className="flex flex-col gap-3 py-6">
            <h2 className="font-serif text-2xl text-on-navy">{t.apply}</h2>
            <p>
              <a
                href={applyHref}
                className="inline-flex items-center gap-3 rounded-xs bg-paper px-6 py-4 text-base font-medium text-navy-900 transition-colors hover:bg-brass-light focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
                {...(!isMailto ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {isMailto ? applyHref.slice('mailto:'.length) : t.apply}
              </a>
            </p>
          </Container>
        )}
      </article>
    </div>
  );
}
