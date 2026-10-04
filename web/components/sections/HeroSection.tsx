import { resolveLinks } from '@/lib/links';
import { localize } from '@/lib/sanity/localize';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { SanityImage } from '@/components/SanityImage';
import type { SectionProps } from './types';

interface Props extends SectionProps<'heroSection'> {
  /** The first section on a page carries the page's only <h1>. */
  isPageHeading: boolean;
}

export function HeroSection({ section, locale, isPageHeading }: Props) {
  const Heading = isPageHeading ? 'h1' : 'h2';
  const subheading = localize(section.subheading, locale);
  const ctas = resolveLinks(section.ctas, locale);

  return (
    <section className="py-16 md:py-24">
      <Container className="grid items-center gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Heading className="font-serif text-4xl leading-tight text-brand md:text-5xl">
            {localize(section.heading, locale)}
          </Heading>
          {subheading && <p className="text-lg text-muted">{subheading}</p>}
          {ctas.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {ctas.map((link, index) => (
                <ButtonLink
                  key={link.key}
                  link={link}
                  variant={index === 0 ? 'primary' : 'secondary'}
                />
              ))}
            </div>
          )}
        </div>
        <SanityImage
          image={section.image}
          locale={locale}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="h-auto w-full"
          priority={isPageHeading}
        />
      </Container>
    </section>
  );
}
