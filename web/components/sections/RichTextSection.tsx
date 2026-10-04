import { localize } from '@/lib/sanity/localize';
import { Container } from '@/components/ui/Container';
import { PortableTextRenderer } from '@/components/PortableTextRenderer';
import type { SectionProps } from './types';

export function RichTextSection({ section, locale }: SectionProps<'richTextSection'>) {
  const heading = localize(section.heading, locale);

  return (
    <section className="py-12 md:py-16">
      <Container className="prose prose-lg max-w-3xl">
        {heading && <h2 className="font-serif text-brand">{heading}</h2>}
        <PortableTextRenderer value={localize(section.body, locale)} />
      </Container>
    </section>
  );
}
