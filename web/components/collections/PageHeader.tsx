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
  /** Small line above the title, e.g. "01 of 15" on a practice-area page. */
  index?: string;
  children?: ReactNode;
}

/**
 * Top of every corporate preset page: the page's only <h1>, plus BreadcrumbList
 * structured data (Home > list page > this page).
 *
 * Harianja & Putra editorial header (design/Design.pen): breadcrumb trail
 * (Parent / Current), uppercase eyebrow label, display-serif H1 and a lead
 * intro - on-navy on the pages' navy-950 background.
 */
export function PageHeader({ locale, path, title, eyebrow, intro, back, index, children }: Props) {
  const trail = [
    { name: getDictionary(locale).homeLabel, path: localePath(locale) },
    ...(back ? [{ name: back.label, path: back.href }] : []),
    { name: title, path },
  ];
  const breadcrumbs = breadcrumbJsonLd(
    trail.map((item) => ({ name: item.name, url: absoluteUrl(item.path) })),
  );

  return (
    <Container className="flex flex-col gap-6 pb-12 pt-14 md:pb-16 md:pt-20">
      <JsonLd data={breadcrumbs} />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2.5 text-sm">
          {trail.map((item, position) => {
            const isLast = position === trail.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-2.5">
                {position > 0 && (
                  <span aria-hidden="true" className="text-on-navy-2/60">
                    /
                  </span>
                )}
                {isLast ? (
                  <span aria-current="page" className="text-on-navy">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.path}
                    className="text-on-navy-2 transition-colors hover:text-brass-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <div className="flex flex-col gap-5">
        {index && <p className="text-sm tracking-wide text-on-navy-2">{index}</p>}
        {eyebrow && (
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-on-navy-2">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-4xl font-display text-5xl leading-[1.05] tracking-tight text-balance text-on-navy md:text-7xl">
          {title}
        </h1>
        {intro && <p className="max-w-3xl text-lg leading-relaxed text-on-navy-2">{intro}</p>}
      </div>
      {children}
    </Container>
  );
}
