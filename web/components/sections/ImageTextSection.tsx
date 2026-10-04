import { localize } from '@/lib/sanity/localize';
import { Container } from '@/components/ui/Container';
import { PortableTextRenderer } from '@/components/PortableTextRenderer';
import { SanityImage } from '@/components/SanityImage';
import type { SectionProps } from './types';

export function ImageTextSection({ section, locale }: SectionProps<'imageTextSection'>) {
  const heading = localize(section.heading, locale);
  const imageFirst = section.imagePosition !== 'right';

  return (
    <section className="py-16 md:py-20">
      <Container className="grid items-center gap-10 md:grid-cols-2">
        <SanityImage
          image={section.image}
          locale={locale}
          sizes="(min-width: 768px) 50vw, 100vw"
          className={`h-auto w-full ${imageFirst ? '' : 'md:order-last'}`}
        />
        <div className="prose">
          {heading && <h2 className="font-serif text-brand">{heading}</h2>}
          <PortableTextRenderer value={localize(section.body, locale)} />
        </div>
      </Container>
    </section>
  );
}
