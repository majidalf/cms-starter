import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';

interface Props {
  title: string;
  /** Nothing renders when there is nothing to relate - no empty headings. */
  isEmpty: boolean;
  children: ReactNode;
}

/**
 * A labelled content block on a detail page ("Areas of work", "Credentials",
 * "Related services"). Editorial label (design/Design.pen): small uppercase
 * on-navy-2 label with the content under a thin on-navy rule.
 */
export function RelatedBlock({ title, isEmpty, children }: Props) {
  if (isEmpty) return null;
  return (
    <section className="py-10">
      <Container className="flex flex-col gap-6">
        <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-on-navy-2">{title}</h2>
        <div className="border-t border-on-navy/15 pt-8">{children}</div>
      </Container>
    </section>
  );
}
