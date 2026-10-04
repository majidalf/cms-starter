import Link from 'next/link';
import type { ReactNode } from 'react';
import { getDictionary, localePath, type Locale } from '@/lib/i18n';
import { breadcrumbJsonLd } from '@/lib/jsonLd';
import { absoluteUrl } from '@/lib/site';
import { Container } from '@/components/ui/Container';
import { JsonLd } from '@/components/JsonLd';

interface Props {
  locale: Locale;
  /** This page's path (with language prefix), for the breadcrumb structured data. */
  path: string;
  title: string;
  /** Small line above the title, e.g. a category or date. */
  eyebrow?: ReactNode;
  intro?: string;
  /** Link back to the collection's list page, shown on detail pages. */
  back?: { href: string; label: string };
  children?: ReactNode;
}

/** Top of every corporate preset page: the page's only <h1>, plus BreadcrumbList structured
 * data (Home > list page > this page). */
export function PageHeader({ locale, path, title, eyebrow, intro, back, children }: Props) {
  const trail = [
    { name: getDictionary(locale).home, path: localePath(locale) },
    ...(back ? [{ name: back.label, path: back.href }] : []),
    { name: title, path },
  ];
  const breadcrumbs = breadcrumbJsonLd(
    trail.map((item) => ({ name: item.name, url: absoluteUrl(item.path) })),
  );

  return (
    <Container className="flex flex-col gap-4 pb-8 pt-16 md:pt-24">
      <JsonLd data={breadcrumbs} />
      {back && (
        <Link href={back.href} className="text-sm text-muted hover:text-ink">
          <span aria-hidden="true">← </span>
          {back.label}
        </Link>
      )}
      {eyebrow && <p className="text-sm uppercase tracking-wide text-muted">{eyebrow}</p>}
      <h1 className="max-w-4xl font-serif text-4xl leading-tight text-brand md:text-5xl">
        {title}
      </h1>
      {intro && <p className="max-w-3xl text-lg text-muted">{intro}</p>}
      {children}
    </Container>
  );
}
