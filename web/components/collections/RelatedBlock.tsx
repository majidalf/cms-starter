import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';

interface Props {
  title: string;
  /** Nothing renders when there is nothing to relate - no empty headings. */
  isEmpty: boolean;
  children: ReactNode;
}

export function RelatedBlock({ title, isEmpty, children }: Props) {
  if (isEmpty) return null;
  return (
    <section className="py-10">
      <Container className="flex flex-col gap-6">
        <h2 className="font-serif text-2xl text-brand">{title}</h2>
        {children}
      </Container>
    </section>
  );
}
