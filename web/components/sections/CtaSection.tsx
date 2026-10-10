import { resolveLink } from '@/lib/links';
import { localize } from '@/lib/sanity/localize';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/ButtonLink';
import type { SectionProps } from './types';

/**
 * CTA panel placed by the editor through the page builder. Navy-800 panel
 * (design/Design.pen -> CTA Panel): display heading, lead text and a paper
 * button. The panel works on light and dark page backgrounds alike.
 */
export function CtaSection({ section, locale }: SectionProps<'ctaSection'>) {
  const text = localize(section.text, locale);
  const cta = section.cta ? resolveLink(section.cta, locale) : undefined;

  return (
    <section className="py-16 md:py-20">
      <Container>
        <div className="grid gap-8 rounded-panel bg-navy-800 p-8 text-on-navy md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-12">
          <div className="flex max-w-2xl flex-col gap-3">
            <h2 className="font-display text-3xl leading-tight tracking-tight text-balance md:text-4xl">
              {localize(section.heading, locale)}
            </h2>
            {text && <p className="leading-relaxed text-on-navy-2">{text}</p>}
          </div>
          {cta && <ButtonLink link={cta} variant="inverse" />}
        </div>
      </Container>
    </section>
  );
}
