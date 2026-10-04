import { resolveLink } from '@/lib/links';
import { localize } from '@/lib/sanity/localize';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/ButtonLink';
import type { SectionProps } from './types';

export function CtaSection({ section, locale }: SectionProps<'ctaSection'>) {
  const text = localize(section.text, locale);
  const cta = section.cta ? resolveLink(section.cta, locale) : undefined;

  return (
    <section className="bg-brand py-16 text-surface">
      <Container className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 className="font-serif text-3xl">{localize(section.heading, locale)}</h2>
          {text && <p className="text-surface/80">{text}</p>}
        </div>
        {cta && <ButtonLink link={cta} variant="inverse" />}
      </Container>
    </section>
  );
}
