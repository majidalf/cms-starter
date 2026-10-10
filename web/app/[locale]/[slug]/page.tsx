import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { detailPaths, redirectToLocalizedSlug, slugParams } from '@/lib/collectionRoutes';
import { fill, formatDate, getDictionary, isLocale, localePath } from '@/lib/i18n';
import { localize } from '@/lib/sanity/localize';
import {
  getPageByAnySlug,
  getPageBySlug,
  getPageSlugs,
  getSiteSettings,
} from '@/lib/sanity/queries';
import { buildMetadata } from '@/lib/seo';
import { PortableTextRenderer } from '@/components/PortableTextRenderer';
import { PageHeader } from '@/components/sections/PageHeader';
import { PageSections } from '@/components/sections/PageSections';
import { DesignNote } from '@/components/ui/DesignNote';

const BASE = '';

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  return slugParams(await getPageSlugs(), params.locale);
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const [page, settings] = await Promise.all([getPageBySlug(locale, slug), getSiteSettings()]);
  if (!page) return {};

  return buildMetadata({
    locale,
    title: localize(page.title, locale),
    seo: page.seo,
    defaults: settings?.defaultSeo,
    paths: detailPaths(BASE, page.slug),
  });
}

/**
 * A `page` document (Design.pen → Legal Page · Desktop 1440 / Mobile 375 - Disclaimer,
 * Privacy Policy): title and "Last updated", then "On this page" in the first third beside
 * the text at 720px. Each rich text section is one titled part; other section types follow.
 */
export default async function Page({ params }: PageProps<'/[locale]/[slug]'>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const page = await getPageBySlug(locale, slug);
  if (!page) return redirectToLocalizedSlug(locale, slug, BASE, getPageByAnySlug);

  const t = getDictionary(locale);
  const title = localize(page.title, locale) ?? '';
  const sections = page.sections ?? [];
  const parts = sections.flatMap((section) =>
    section._type === 'richTextSection'
      ? [
          {
            id: `part-${section._key}`,
            heading: localize(section.heading, locale),
            body: localize(section.body, locale),
          },
        ]
      : [],
  );
  const headings = parts.flatMap((part) =>
    part.heading ? [{ id: part.id, text: part.heading }] : [],
  );
  const contents = (
    <ol className="flex flex-col border-line-navy lg:border-t">
      {headings.map((heading) => (
        <li key={heading.id} className="border-line-navy not-last:border-b lg:border-b">
          <a
            href={`#${heading.id}`}
            className="block py-3 text-[16px] leading-[19px] text-on-navy transition-colors hover:text-brass-light"
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <PageHeader
        breadcrumbLabel={t.breadcrumb}
        breadcrumb={[{ label: t.homeLabel, href: localePath(locale) }, { label: title }]}
        label={t.legal.label}
        title={title}
        titleSize="xl"
        spacing="pb-8 lg:pb-[72px]"
      >
        <p className="text-[14px] leading-[17px] text-on-navy-2">
          {fill(t.legal.updated, { date: formatDate(page._updatedAt, locale) ?? '' })}
        </p>
      </PageHeader>
      {parts.length > 0 && (
        <div className="relative mx-auto flex w-full max-w-[1440px] flex-col px-4 pb-[72px] lg:flex-row lg:items-start lg:px-5 lg:pb-[120px]">
          {headings.length > 0 && (
            <aside className="pb-8 lg:sticky lg:top-28 lg:w-1/3 lg:shrink-0 lg:pb-0 lg:pr-10">
              <nav aria-label={t.legal.onThisPage} className="hidden flex-col gap-3 lg:flex">
                <p className="text-[13px] leading-[15px] text-on-navy-2">{t.legal.onThisPage}</p>
                {contents}
              </nav>
              <details className="group border-y border-line-navy lg:hidden">
                <summary className="flex h-[55px] cursor-pointer list-none items-center justify-between text-[16px] text-on-navy -outline-offset-2 [&::-webkit-details-marker]:hidden">
                  {t.legal.onThisPage}
                  <span aria-hidden="true" className="text-[20px] text-on-navy-2 group-open:hidden">
                    +
                  </span>
                  <span
                    aria-hidden="true"
                    className="hidden text-[20px] text-on-navy-2 group-open:inline"
                  >
                    −
                  </span>
                </summary>
                <nav aria-label={t.legal.onThisPage} className="pb-2">
                  {contents}
                </nav>
              </details>
            </aside>
          )}
          <div className="flex w-full flex-col gap-9 lg:max-w-[720px] lg:gap-12">
            {parts.map((part) => (
              <section
                key={part.id}
                id={part.id}
                className="flex scroll-mt-28 flex-col gap-3 lg:gap-4"
              >
                {part.heading && (
                  <h2 className="font-serif text-[26px] leading-[31px] text-on-navy lg:text-[32px] lg:leading-[38px]">
                    {part.heading}
                  </h2>
                )}
                <PortableTextRenderer value={part.body} className="gap-4 text-on-navy" />
              </section>
            ))}
            <DesignNote className="text-[14px] leading-[21px] lg:text-[13px] lg:leading-[20px]">
              {t.legal.draftNote}
            </DesignNote>
          </div>
        </div>
      )}
      <PageSections sections={sections} locale={locale} />
    </>
  );
}
