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
    <article className="pb-16">
      <PageHeader
        title={localize(opening.title, locale) ?? ''}
        back={{ href: localePath(locale, BASE), label: t.careers }}
      >
        <dl className="flex flex-wrap gap-x-10 gap-y-2 text-sm">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-muted">{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>
      <RichText value={localize(opening.description, locale)} />
      {applyHref && (
        <Container className="flex flex-col gap-3 py-6">
          <h2 className="font-serif text-2xl text-brand">{t.apply}</h2>
          <p>
            <a
              href={applyHref}
              className="inline-flex items-center bg-brand px-5 py-3 text-sm font-medium text-surface hover:bg-ink"
              {...(!isMailto ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {isMailto ? applyHref.slice('mailto:'.length) : t.apply}
            </a>
          </p>
        </Container>
      )}
    </article>
  );
}
