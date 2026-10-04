import { localize } from '@/lib/sanity/localize';
import { Container } from '@/components/ui/Container';
import type { SectionProps } from './types';

export function FeatureListSection({ section, locale }: SectionProps<'featureListSection'>) {
  const intro = localize(section.intro, locale);

  return (
    <section className="py-16 md:py-20">
      <Container className="flex flex-col gap-10">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 className="font-serif text-3xl text-brand">{localize(section.heading, locale)}</h2>
          {intro && <p className="text-muted">{intro}</p>}
        </div>
        <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {(section.items ?? []).map((item) => {
            const description = localize(item.description, locale);
            return (
              <li key={item._key} className="flex flex-col gap-2 border-t border-ink/15 pt-5">
                <h3 className="font-medium text-ink">{localize(item.title, locale)}</h3>
                {description && <p className="text-sm text-muted">{description}</p>}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
