import Link from 'next/link';
import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';

interface Props {
  title: string;
  /** Small line above the title, e.g. a category or date. */
  eyebrow?: ReactNode;
  intro?: string;
  /** Link back to the collection's list page, shown on detail pages. */
  back?: { href: string; label: string };
  children?: ReactNode;
}

/** Top of every corporate preset page: the page's only <h1>. */
export function PageHeader({ title, eyebrow, intro, back, children }: Props) {
  return (
    <Container className="flex flex-col gap-4 pb-8 pt-16 md:pt-24">
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
